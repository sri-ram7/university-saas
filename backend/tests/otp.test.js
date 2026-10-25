process.env.NODE_ENV = "test";
process.env.AUTH_RATE_LIMIT_MAX_REQUESTS = "50";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-key";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test-refresh-secret-key";

const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const authRoutes = require("../routes/authRoutes");
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
  console.log("🧪 Starting OTP Functionality Test Suite");
  console.log("=================================================");

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
      const testTarget = `otp.user.${Date.now()}@example.com`;
      const loginPurpose = "login";
      const resetPurpose = "password-reset";

      // Step 1: Send OTP for Login Purpose
      console.log("\n--- Step 1: Send 6-Digit OTP ---");
      const sendRes = await makeRequest(port, "/api/auth/send-otp", "POST", {
        target: testTarget,
        purpose: loginPurpose,
        email: testTarget,
      });
      assert(sendRes.statusCode === 200, "Send OTP returns HTTP 200");
      assert(
        sendRes.body && sendRes.body.data && Boolean(sendRes.body.data.rawOtp),
        "Raw OTP generated in test mode"
      );

      const rawOtp = sendRes.body.data.rawOtp;
      assert(typeof rawOtp === "string" && rawOtp.length === 6, "OTP is a 6-digit string");

      // Step 2: Resend Cooldown Enforcement (60s)
      console.log("\n--- Step 2: Resend Cooldown Enforcement (60s) ---");
      const resendRes = await makeRequest(port, "/api/auth/send-otp", "POST", {
        target: testTarget,
        purpose: loginPurpose,
        email: testTarget,
      });
      assert(resendRes.statusCode === 429, "Immediate resend request triggers 60s cooldown (HTTP 429)");

      // Step 3: Purpose-Specific Isolation Test
      console.log("\n--- Step 3: Purpose-Specific Isolation Test ---");
      const wrongPurposeRes = await makeRequest(port, "/api/auth/verify-otp", "POST", {
        target: testTarget,
        purpose: resetPurpose, // Using login OTP for password reset purpose
        otp: rawOtp,
      });
      assert(wrongPurposeRes.statusCode === 400, "Using OTP for wrong purpose returns HTTP 400");

      // Step 4: Incorrect OTP Attempt Count & Lockout Test
      console.log("\n--- Step 4: Incorrect OTP Attempt Count & Lockout ---");
      const testTarget2 = `otp.attempt.${Date.now()}@example.com`;
      const send2Res = await makeRequest(port, "/api/auth/send-otp", "POST", {
        target: testTarget2,
        purpose: loginPurpose,
        email: testTarget2,
      });
      const rawOtp2 = send2Res.body.data.rawOtp;

      // Attempt 1: Wrong OTP
      const wrong1 = await makeRequest(port, "/api/auth/verify-otp", "POST", {
        target: testTarget2,
        purpose: loginPurpose,
        otp: "000000",
      });
      assert(wrong1.statusCode === 400, "Wrong OTP attempt 1 returns HTTP 400");
      assert(
        wrong1.body.message && wrong1.body.message.includes("2 attempt(s) remaining"),
        "Message indicates 2 attempts remaining"
      );

      // Attempt 2: Wrong OTP
      const wrong2 = await makeRequest(port, "/api/auth/verify-otp", "POST", {
        target: testTarget2,
        purpose: loginPurpose,
        otp: "000000",
      });
      assert(wrong2.statusCode === 400, "Wrong OTP attempt 2 returns HTTP 400");

      // Attempt 3: Wrong OTP (Exceeds 3 attempts limit)
      const wrong3 = await makeRequest(port, "/api/auth/verify-otp", "POST", {
        target: testTarget2,
        purpose: loginPurpose,
        otp: "000000",
      });
      assert(wrong3.statusCode === 400, "Wrong OTP attempt 3 triggers lockout (HTTP 400)");
      assert(
        wrong3.body.message && wrong3.body.message.includes("Maximum OTP verification attempts exceeded"),
        "Lockout message returned"
      );

      // Verify that even the correct OTP is now rejected because lockout deleted the OTP
      const postLockoutRes = await makeRequest(port, "/api/auth/verify-otp", "POST", {
        target: testTarget2,
        purpose: loginPurpose,
        otp: rawOtp2,
      });
      assert(postLockoutRes.statusCode === 400, "Correct OTP rejected after 3 failed attempts lockout");

      // Step 5: Valid OTP Verification
      console.log("\n--- Step 5: Valid OTP Verification ---");
      const verifyRes = await makeRequest(port, "/api/auth/verify-otp", "POST", {
        target: testTarget,
        purpose: loginPurpose,
        otp: rawOtp,
      });
      assert(verifyRes.statusCode === 200, "Valid OTP verification returns HTTP 200");

      // Step 6: Single-Use Deletion / Reuse Prevention Test
      console.log("\n--- Step 6: Token Reuse Prevention Test ---");
      const reuseRes = await makeRequest(port, "/api/auth/verify-otp", "POST", {
        target: testTarget,
        purpose: loginPurpose,
        otp: rawOtp,
      });
      assert(reuseRes.statusCode === 400, "Reusing verified OTP returns HTTP 400");

      console.log("\n=================================================");
      console.log(`Test Summary: ${passedCount} PASSED, ${failedCount} FAILED`);
      console.log("=================================================");

      server.close();
      if (failedCount > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    } catch (err) {
      console.error("Test execution error:", err);
      server.close();
      process.exit(1);
    }
  });
}

runTests();
