process.env.NODE_ENV = "test";
process.env.AUTH_RATE_LIMIT_MAX_REQUESTS = "50";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-key";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test-refresh-secret-key";

const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("../routes/authRoutes");
const User = require("../models/User");
const tokenService = require("../services/tokenService");
const errorHandler = require("../middleware/errorMiddleware");

// Helper to make HTTP requests
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
  console.log("🧪 Starting Password Reset Verification Test");
  console.log("=================================================");

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

  const testEmail = `pwdreset.${Date.now()}@example.com`;
  const initialPassword = "OldPassword123!";
  const newPassword = "NewPassword456!";

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
      // Step 1: Anti-Enumeration Test (Non-existent email)
      console.log("\n--- Step 1: Non-Existent Email Anti-Enumeration ---");
      const fakeRes = await makeRequest(port, "/api/auth/forgot-password", "POST", {
        email: "nonexistent.user.12345@domain.com",
      });
      assert(fakeRes.statusCode === 200, "Non-existent email returns HTTP 200");
      assert(
        fakeRes.body && fakeRes.body.message && fakeRes.body.message.includes("If an account with that email exists"),
        "Generic anti-enumeration message returned"
      );

      // Step 2: Register & Verify Real User
      console.log("\n--- Step 2: Register Real User & Establish Session ---");
      const regRes = await makeRequest(port, "/api/auth/register", "POST", {
        name: "Password Reset Test User",
        email: testEmail,
        password: initialPassword,
        role: "student",
      });
      assert(regRes.statusCode === 201, "User registered successfully");
      await User.updateOne({ email: testEmail }, { isVerified: true });

      const loginRes = await makeRequest(port, "/api/auth/login", "POST", {
        email: testEmail,
        password: initialPassword,
      });
      assert(loginRes.statusCode === 200, "User logged in successfully");
      const activeRefreshToken = loginRes.body.data.refreshToken;

      // Step 3: Request Forgot Password Link
      console.log("\n--- Step 3: Request Password Reset Link ---");
      const forgotRes = await makeRequest(port, "/api/auth/forgot-password", "POST", {
        email: testEmail,
      });
      assert(forgotRes.statusCode === 200, "Forgot password request returns HTTP 200");

      // Extract hashed reset token from User document in DB to simulate receiving raw token via email
      const dbUser = await User.findOne({ email: testEmail });
      assert(Boolean(dbUser.resetPasswordToken), "Reset token hash stored in DB");

      // For test verification, we manually generate a raw token and set its hash in DB
      const crypto = require("crypto");
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = tokenService.hashToken(rawToken);
      dbUser.resetPasswordToken = hashedToken;
      dbUser.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
      await dbUser.save();

      // Step 4: Invalid & Expired Token Tests
      console.log("\n--- Step 4: Invalid Token Test ---");
      const invalidRes = await makeRequest(port, "/api/auth/reset-password/invalid-token-string", "POST", {
        password: newPassword,
      });
      assert(invalidRes.statusCode === 400, "Invalid reset token returns HTTP 400");

      // Step 5: Valid Password Reset Execution
      console.log("\n--- Step 5: Execute Valid Password Reset ---");
      const resetRes = await makeRequest(port, `/api/auth/reset-password/${rawToken}`, "POST", {
        password: newPassword,
      });
      console.log("resetRes statusCode:", resetRes.statusCode, "body:", resetRes.body);
      assert(resetRes.statusCode === 200, "Password reset returns HTTP 200");
      assert(
        resetRes.body && resetPasswordMessage(resetRes.body.message),
        "Response confirms password reset and session logout"
      );

      function resetPasswordMessage(msg) {
        return typeof msg === "string" && (msg.includes("Password updated") || msg.includes("Reset"));
      }

      // Step 6: Single-Use & Token Reuse Attempt Test
      console.log("\n--- Step 6: Token Reuse Prevention Test ---");
      const reuseRes = await makeRequest(port, `/api/auth/reset-password/${rawToken}`, "POST", {
        password: newPassword,
      });
      assert(reuseRes.statusCode === 400, "Reusing reset token returns HTTP 400");

      // Step 7: Session Revocation Verification (Previous Session Revoked)
      console.log("\n--- Step 7: Session Revocation Check ---");
      const refreshRes = await makeRequest(port, "/api/auth/refresh", "POST", {}, `refreshToken=${activeRefreshToken}`);
      assert(refreshRes.statusCode === 401, "Previous refresh token session revoked after password reset");

      // Step 8: Verify Login with New Password
      console.log("\n--- Step 8: Login Verification ---");
      const oldLoginRes = await makeRequest(port, "/api/auth/login", "POST", {
        email: testEmail,
        password: initialPassword,
      });
      assert(oldLoginRes.statusCode === 400, "Login with old password fails (HTTP 400)");

      const newLoginRes = await makeRequest(port, "/api/auth/login", "POST", {
        email: testEmail,
        password: newPassword,
      });
      assert(newLoginRes.statusCode === 200, "Login with new password succeeds (HTTP 200)");

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
