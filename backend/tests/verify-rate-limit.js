process.env.NODE_ENV = "test";
const express = require("express");
const http = require("http");
const { globalRateLimiter, authRateLimiter } = require("../middleware/rateLimiter");
const ApiResponse = require("../utils/ApiResponse");

// Helper function to make HTTP GET/POST requests locally
const makeRequest = (port, path, method = "GET", body = null) => {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : "";
    const options = {
      hostname: "127.0.0.1",
      port: port,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(body ? { "Content-Length": Buffer.byteLength(dataString) } : {}),
      },
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
  console.log("==========================================");
  console.log("🧪 Starting Rate Limiter Verification Test");
  console.log("==========================================");

  const app = express();
  app.use(express.json());

  // Mount global rate limiter on /api
  app.use("/api", globalRateLimiter);

  // General endpoint
  app.get("/api/test-general", (req, res) => {
    res.json(new ApiResponse(200, "General endpoint success", { test: true }));
  });

  // Auth endpoint with auth rate limiter
  app.post("/api/auth/login", authRateLimiter, (req, res) => {
    res.json(new ApiResponse(200, "Login success", { token: "fake-jwt" }));
  });

  // Swagger docs endpoint (should be skipped by global rate limiter)
  app.get("/api/docs", (req, res) => {
    res.send("Swagger Docs UI");
  });

  const server = app.listen(0, "127.0.0.1", async () => {
    const port = server.address().port;
    console.log(`Server listening on temporary port ${port}`);

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
      // Test 1: Verify General Endpoint works initially and sets rate limit headers
      console.log("\n--- Test 1: Global Endpoint Request ---");
      const res1 = await makeRequest(port, "/api/test-general");
      assert(res1.statusCode === 200, "Initial request returns HTTP 200");
      assert(res1.body.success === true, "ApiResponse success field is true");
      assert(
        res1.headers["ratelimit-limit"] !== undefined || res1.headers["x-ratelimit-limit"] !== undefined,
        "Rate limit headers present"
      );

      // Test 2: Verify Auth Endpoint Rate Limiting (threshold = 5 requests)
      console.log("\n--- Test 2: Auth Rate Limiter Threshold (Max 5 Requests) ---");
      let hit429 = false;
      let lastRes = null;

      for (let i = 1; i <= 6; i++) {
        lastRes = await makeRequest(port, "/api/auth/login", "POST", { email: "test@example.com" });
        console.log(` Request #${i} -> Status ${lastRes.statusCode}`);
        if (lastRes.statusCode === 429) {
          hit429 = true;
          break;
        }
      }

      assert(hit429, "Auth Endpoint returned HTTP 429 after exceeding limit");
      assert(lastRes && lastRes.body && lastRes.body.success === false, "429 Response success field is false");
      assert(lastRes && lastRes.body && lastRes.body.statusCode === 429, "429 Response statusCode is 429");
      assert(
        lastRes && lastRes.body && typeof lastRes.body.message === "string",
        "429 Response contains ApiResponse message"
      );
      assert(
        lastRes && (lastRes.headers["retry-after"] !== undefined || lastRes.headers["ratelimit-reset"] !== undefined),
        "429 Response contains Retry-After / RateLimit-Reset header"
      );

      // Test 3: Verify Swagger Docs Excluded from Global Limiter
      console.log("\n--- Test 3: Docs Route Excluded ---");
      const docsRes = await makeRequest(port, "/api/docs");
      assert(docsRes.statusCode === 200, "/api/docs route accessible without rate limiting");

      console.log("\n==========================================");
      console.log(`Test Summary: ${passedCount} PASSED, ${failedCount} FAILED`);
      console.log("==========================================");

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
