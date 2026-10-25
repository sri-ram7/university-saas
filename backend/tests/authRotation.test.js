process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-key";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test-refresh-secret-key";

const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("../routes/authRoutes");
const User = require("../models/User");
const errorHandler = require("../middleware/errorMiddleware");

// Helper to parse cookies from Set-Cookie header array
const parseSetCookieHeader = (setCookieArray) => {
  if (!setCookieArray) return {};
  const cookies = {};
  const array = Array.isArray(setCookieArray) ? setCookieArray : [setCookieArray];
  array.forEach((cookieStr) => {
    const parts = cookieStr.split(";")[0].split("=");
    if (parts.length === 2) {
      cookies[parts[0].trim()] = parts[1].trim();
    }
  });
  return cookies;
};

// Helper function to make HTTP requests
const makeRequest = (port, path, method = "GET", body = null, cookieHeader = null, authHeader = null) => {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : "";
    const headers = {
      "Content-Type": "application/json",
      ...(body ? { "Content-Length": Buffer.byteLength(dataString) } : {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(authHeader ? { Authorization: `Bearer ${authHeader}` } : {}),
    };

    const options = {
      hostname: "127.0.0.1",
      port: port,
      path: path,
      method: method,
      headers: headers,
    };

    const req = http.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(responseBody);
        } catch (e) {
          json = responseBody;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          setCookie: res.headers["set-cookie"],
          cookies: parseSetCookieHeader(res.headers["set-cookie"]),
          body: json,
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (body) {
      req.write(dataString);
    }
    req.end();
  });
};

async function runTests() {
  console.log("=================================================");
  console.log("🧪 Starting Refresh Token Rotation Verification");
  console.log("=================================================");

  // Each standalone run gets a disposable in-memory database.
  const { MongoMemoryServer } = require("mongodb-memory-server");
  let mongoServer;

  try {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    console.log("✅ DB Connected for test");
  } catch (err) {
    console.error("DB connection error:", err.message);
    if (mongoServer) await mongoServer.stop();
    process.exit(1);
  }

  const testEmail = `test.rotation.${Date.now()}@example.com`;
  const testPassword = "Password123!";

  // Setup test Express app
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/auth", authRoutes);
  app.use(errorHandler);

  const server = app.listen(0, "127.0.0.1", async () => {
    const port = server.address().port;
    console.log(`Test server running on port ${port}`);

    let passedCount = 0;
    let failedCount = 0;

    const assert = (condition, testName) => {
      if (condition) {
        console.log(`✅ PASS: ${testName}`);
        passedCount++;
      } else {
        console.error(`❌ FAIL: ${testName}`);
        failedCount++;
      }
    };

    try {
      // Step 1: Register test user
      console.log("\n--- Step 1: User Registration ---");
      const regRes = await makeRequest(port, "/api/auth/register", "POST", {
        name: "Rotation Test User",
        email: testEmail,
        password: testPassword,
        role: "student",
      });
      assert(regRes.statusCode === 201, "User registered successfully");

      // Auto verify user in DB for test
      await User.updateOne({ email: testEmail }, { isVerified: true });

      // Step 2: Login Device 1 (Session Family 1)
      console.log("\n--- Step 2: Device 1 Login ---");
      const login1Res = await makeRequest(port, "/api/auth/login", "POST", {
        email: testEmail,
        password: testPassword,
      });
      assert(login1Res.statusCode === 200, "Device 1 login returns HTTP 200");
      assert(Boolean(login1Res.body.data.accessToken), "Device 1 received accessToken");
      assert(Boolean(login1Res.body.data.refreshToken), "Device 1 received refreshToken in JSON");
      assert(Boolean(login1Res.cookies.refreshToken), "Device 1 received HttpOnly refreshToken cookie");

      const refreshToken1_v1 = login1Res.body.data.refreshToken;
      const cookie1_v1 = `refreshToken=${refreshToken1_v1}`;

      // Step 3: Rotate Refresh Token for Device 1
      console.log("\n--- Step 3: Refresh Token Rotation (Device 1) ---");
      const refresh1Res = await makeRequest(port, "/api/auth/refresh", "POST", {}, cookie1_v1);
      assert(refresh1Res.statusCode === 200, "First refresh request returns HTTP 200");
      assert(Boolean(refresh1Res.body.data.accessToken), "Received new access token");
      assert(Boolean(refresh1Res.body.data.refreshToken), "Received rotated refresh token");

      const refreshToken1_v2 = refresh1Res.body.data.refreshToken;
      const cookie1_v2 = `refreshToken=${refreshToken1_v2}`;
      assert(refreshToken1_v1 !== refreshToken1_v2, "Rotated refresh token is different from old token");

      // Step 4: REUSE DETECTION TEST (Attempting to reuse old refreshToken1_v1)
      console.log("\n--- Step 4: Token Reuse Detection (Reusing old refreshToken1_v1) ---");
      const reuseRes = await makeRequest(port, "/api/auth/refresh", "POST", {}, cookie1_v1);
      assert(reuseRes.statusCode === 401, "Reusing old refresh token returns HTTP 401");
      assert(
        reuseRes.body.message && reuseRes.body.message.includes("reuse detected"),
        "Error message indicates refresh token reuse detection"
      );

      // Step 5: Verify Session Family 1 was revoked due to reuse detection
      console.log("\n--- Step 5: Session Family Revocation Check ---");
      const postReuseRefresh = await makeRequest(port, "/api/auth/refresh", "POST", {}, cookie1_v2);
      assert(postReuseRefresh.statusCode === 401, "Rotated token (refreshToken1_v2) is also revoked after reuse");

      // Step 6: Multi-Device Isolation (Login Device 2 - Session Family 2)
      console.log("\n--- Step 6: Multi-Device Session Isolation ---");
      const login2Res = await makeRequest(port, "/api/auth/login", "POST", {
        email: testEmail,
        password: testPassword,
      });
      assert(login2Res.statusCode === 200, "Device 2 login returns HTTP 200");
      const refreshToken2_v1 = login2Res.body.data.refreshToken;
      const cookie2_v1 = `refreshToken=${refreshToken2_v1}`;

      const refresh2Res = await makeRequest(port, "/api/auth/refresh", "POST", {}, cookie2_v1);
      assert(refresh2Res.statusCode === 200, "Device 2 session functions independently");

      // Step 7: Invalid & Expired Token Tests
      console.log("\n--- Step 7: Invalid & Expired Token Tests ---");
      const invalidRes = await makeRequest(port, "/api/auth/refresh", "POST", {}, "refreshToken=invalid-token-string");
      assert(invalidRes.statusCode === 401, "Invalid token string returns HTTP 401");

      // Step 8: Logout & Cookie Clearing
      console.log("\n--- Step 8: Logout & Cookie Clearing ---");
      const accessToken2 = login2Res.body.data.accessToken;
      const logoutRes = await makeRequest(port, "/api/auth/logout", "POST", {}, cookie2_v1, accessToken2);
      assert(logoutRes.statusCode === 200, "Logout returns HTTP 200");
      assert(
        logoutRes.setCookie && logoutRes.setCookie.some((c) => c.includes("refreshToken=;")),
        "Logout response clears HttpOnly cookie"
      );

      console.log("\n=================================================");
      console.log(`Test Summary: ${passedCount} PASSED, ${failedCount} FAILED`);
      console.log("=================================================");

      // Cleanup test user
      await User.deleteOne({ email: testEmail });
      await mongoose.disconnect();
      await mongoServer.stop();
      server.close();

      if (failedCount > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    } catch (err) {
      console.error("Test execution error:", err);
      await User.deleteOne({ email: testEmail });
      await mongoose.disconnect();
      await mongoServer.stop();
      server.close();
      process.exit(1);
    }
  });
}

runTests();
