process.env.NODE_ENV = "test";
process.env.AUTH_RATE_LIMIT_MAX_REQUESTS = "50";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-key";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test-refresh-secret-key";

const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const authRoutes = require("../routes/authRoutes");
const studentRoutes = require("../routes/studentRoutes");
const User = require("../models/User");
const tokenService = require("../services/tokenService");
const errorHandler = require("../middleware/errorMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

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
  console.log("🧪 Starting Email Verification Test Suite");
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

  const testEmail = `email.verify.${Date.now()}@example.com`;
  const testPassword = "Password123!";

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/auth", authRoutes);

  // Protected test route to verify email authorization check
  app.get("/api/protected-resource", authMiddleware, (req, res) => {
    res.json({ success: true, message: "Protected resource accessed" });
  });

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
      // Step 1: Anti-Enumeration Test on Resend Verification (Non-existent Email)
      console.log("\n--- Step 1: Anti-Enumeration Test on Resend Verification ---");
      const fakeResend = await makeRequest(port, "/api/auth/resend-verification", "POST", {
        email: "nonexistent.verify.999@example.com",
      });
      assert(fakeResend.statusCode === 200, "Non-existent email resend returns HTTP 200");
      assert(
        fakeResend.body && fakeResend.body.message && fakeResend.body.message.includes("If an unverified account"),
        "Generic anti-enumeration response returned"
      );

      // Step 2: Register User (Created with emailVerified=false, isVerified=false)
      console.log("\n--- Step 2: Register Unverified User ---");
      const regRes = await makeRequest(port, "/api/auth/register", "POST", {
        name: "Verify Test User",
        email: testEmail,
        password: testPassword,
        role: "student",
      });
      assert(regRes.statusCode === 201, "User registration returns HTTP 201");

      const createdUser = await User.findOne({ email: testEmail });
      assert(createdUser && createdUser.emailVerified === false, "User emailVerified is false initially");
      assert(createdUser && createdUser.isVerified === false, "User isVerified is false initially");

      // Step 3: Unverified User Login & Protected Resource Access Block
      console.log("\n--- Step 3: Unverified User Access Block ---");
      const unverifiedLogin = await makeRequest(port, "/api/auth/login", "POST", {
        email: testEmail,
        password: testPassword,
      });
      assert(unverifiedLogin.statusCode === 403, "Unverified login attempt blocked with HTTP 403");

      // Generate a temporary access token for the unverified user to test authMiddleware block
      const tempAccessToken = tokenService.generateAccessToken(createdUser);
      const unverifiedResourceAccess = await makeRequest(
        port,
        "/api/protected-resource",
        "GET",
        null,
        null,
        tempAccessToken
      );
      assert(unverifiedResourceAccess.statusCode === 403, "Unverified resource access blocked with HTTP 403");

      // Step 4: Resend Verification & Cooldown Enforcement
      console.log("\n--- Step 4: Resend Verification & Cooldown Enforcement ---");
      const resend1 = await makeRequest(port, "/api/auth/resend-verification", "POST", {
        email: testEmail,
      });
      assert(resend1.statusCode === 200, "First resend verification request returns HTTP 200");

      const resend2 = await makeRequest(port, "/api/auth/resend-verification", "POST", {
        email: testEmail,
      });
      assert(resend2.statusCode === 429, "Immediate second resend triggers 60s cooldown (HTTP 429)");

      // Step 5: Invalid Verification Token Test
      console.log("\n--- Step 5: Invalid Verification Token Test ---");
      const invalidVerify = await makeRequest(port, "/api/auth/verify/invalid-token-string");
      assert(invalidVerify.statusCode === 400, "Invalid verification token returns HTTP 400");

      // Step 6: Valid Email Verification Execution
      console.log("\n--- Step 6: Valid Email Verification ---");
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = tokenService.hashToken(rawToken);
      createdUser.verificationToken = hashedToken;
      await createdUser.save();

      const verifyRes = await makeRequest(port, `/api/auth/verify/${rawToken}`);
      assert(verifyRes.statusCode === 200, "Valid email verification returns HTTP 200");

      const verifiedUser = await User.findOne({ email: testEmail });
      assert(verifiedUser && verifiedUser.emailVerified === true, "User emailVerified is set to true");
      assert(verifiedUser && verifiedUser.isVerified === true, "User isVerified is set to true");
      assert(verifiedUser && verifiedUser.verificationToken === null, "Verification token deleted from DB");

      // Step 7: Single-Use & Token Reuse Attempt Test
      console.log("\n--- Step 7: Token Reuse Prevention Test ---");
      const reuseVerify = await makeRequest(port, `/api/auth/verify/${rawToken}`);
      assert(reuseVerify.statusCode === 400, "Reusing verification token returns HTTP 400");

      // Step 8: Verified User Login & Resource Access
      console.log("\n--- Step 8: Verified User Login & Resource Access ---");
      const verifiedLogin = await makeRequest(port, "/api/auth/login", "POST", {
        email: testEmail,
        password: testPassword,
      });
      assert(verifiedLogin.statusCode === 200, "Verified user login succeeds (HTTP 200)");

      const validAccessToken = verifiedLogin.body.data.accessToken;
      const verifiedResourceAccess = await makeRequest(
        port,
        "/api/protected-resource",
        "GET",
        null,
        null,
        validAccessToken
      );
      assert(verifiedResourceAccess.statusCode === 200, "Verified resource access succeeds (HTTP 200)");

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
