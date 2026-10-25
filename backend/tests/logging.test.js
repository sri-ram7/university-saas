process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "info";
process.env.SLOW_REQUEST_THRESHOLD_MS = "100"; // Low threshold for slow request test

const express = require("express");
const http = require("http");
const requestIdMiddleware = require("../middleware/requestIdMiddleware");
const requestLoggerMiddleware = require("../middleware/requestLoggerMiddleware");
const errorHandler = require("../middleware/errorMiddleware");
const { logger, sanitizeData } = require("../utils/logger");
const ApiError = require("../utils/ApiError");

// Helper to make HTTP requests
const makeRequest = (port, path, method = "GET", headers = {}) => {
  return new Promise((resolve, reject) => {
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
          requestId: res.headers["x-request-id"],
          body: json,
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
};

async function runTests() {
  console.log("=================================================");
  console.log("🧪 Starting Application Logging Test Suite");
  console.log("=================================================");

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

  // Test 1: Sensitive Data Redaction Unit Test
  console.log("\n--- Test 1: Sensitive Data Redactor ---");
  const rawPayload = {
    username: "john_doe",
    password: "SuperSecretPassword123!",
    token: "jwt-token-string-12345",
    nested: {
      otp: "593810",
      cookie: "session=xyz123",
      safeField: "KeepMePlain",
    },
    arrayData: [
      { refreshToken: "ref-token-999" },
      { role: "admin" }
    ]
  };

  const sanitized = sanitizeData(rawPayload);
  assert(sanitized.username === "john_doe", "Non-sensitive username preserved");
  assert(sanitized.password === "[REDACTED]", "Sensitive password redacted");
  assert(sanitized.token === "[REDACTED]", "Sensitive token redacted");
  assert(sanitized.nested.otp === "[REDACTED]", "Nested sensitive OTP redacted");
  assert(sanitized.nested.cookie === "[REDACTED]", "Nested sensitive cookie redacted");
  assert(sanitized.nested.safeField === "KeepMePlain", "Nested safe field preserved");
  assert(sanitized.arrayData[0].refreshToken === "[REDACTED]", "Array element sensitive token redacted");
  assert(sanitized.arrayData[1].role === "admin", "Array element safe field preserved");

  // Setup Test Express App for Request ID & Error Logging Tests
  const app = express();
  app.use(express.json());
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);

  app.get("/api/test-success", (req, res) => {
    res.json({ success: true, message: "OK" });
  });

  app.get("/api/test-slow", (req, res) => {
    setTimeout(() => {
      res.json({ success: true, message: "Slow response done" });
    }, 150); // 150ms delay triggers SLOW_REQUEST_THRESHOLD_MS (100ms)
  });

  app.get("/api/test-error", (req, res) => {
    throw new ApiError(400, "Deliberate test error for logger");
  });

  app.use(errorHandler);

  const server = app.listen(0, "127.0.0.1", async () => {
    const port = server.address().port;
    console.log(`Test logging server running on port ${port}`);

    try {
      // Test 2: Auto-generated X-Request-ID Propagation
      console.log("\n--- Test 2: Auto-Generated X-Request-ID Header ---");
      const res1 = await makeRequest(port, "/api/test-success");
      assert(res1.statusCode === 200, "Success endpoint returns HTTP 200");
      assert(Boolean(res1.requestId), "Response header contains X-Request-ID");
      assert(
        typeof res1.requestId === "string" && res1.requestId.length > 20,
        "X-Request-ID is a valid UUID string"
      );

      // Test 3: Client Provided X-Request-ID Preservation
      console.log("\n--- Test 3: Client-Provided X-Request-ID Preservation ---");
      const customReqId = "custom-client-req-id-12345";
      const res2 = await makeRequest(port, "/api/test-success", "GET", {
        "x-request-id": customReqId,
      });
      assert(res2.requestId === customReqId, "Preserves custom client-provided X-Request-ID header");

      // Test 4: Slow Request Warning Test
      console.log("\n--- Test 4: Slow Request Threshold Warning ---");
      const resSlow = await makeRequest(port, "/api/test-slow");
      assert(resSlow.statusCode === 200, "Slow endpoint returns HTTP 200");

      // Test 5: Global Error Handler Logger Integration Test
      console.log("\n--- Test 5: Global Error Handler Logger Integration ---");
      const resErr = await makeRequest(port, "/api/test-error");
      assert(resErr.statusCode === 400, "Error endpoint returns HTTP 400");
      assert(Boolean(resErr.requestId), "Error response header preserves X-Request-ID");
      assert(resErr.body && resErr.body.message === "Deliberate test error for logger", "Error payload formatted properly");

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
