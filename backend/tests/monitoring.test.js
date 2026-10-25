process.env.NODE_ENV = "test";

const assert = require("assert");
const express = require("express");
const http = require("http");
const requestIdMiddleware = require("../middleware/requestIdMiddleware");
const requestLoggerMiddleware = require("../middleware/requestLoggerMiddleware");
const requestMetricsMiddleware = require("../middleware/requestMetricsMiddleware");
const createHealthRouter = require("../routes/healthRoutes");
const { logger } = require("../utils/logger");
const { register } = require("../monitoring/metrics");

const makeRequest = (port, path, headers = {}) =>
  new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method: "GET",
        headers,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode, headers: res.headers, body });
        });
      }
    );

    req.on("error", reject);
    req.end();
  });

async function withServer(app, callback) {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  try {
    await callback(server.address().port);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

async function runTests() {
  const originalToken = process.env.METRICS_TOKEN;
  const capturedLogs = [];
  const originalInfo = logger.info;
  const originalWarn = logger.warn;
  logger.info = (...args) => capturedLogs.push(args);
  logger.warn = (...args) => capturedLogs.push(args);

  try {
    const app = express();
    app.use(requestIdMiddleware);
    app.use(requestLoggerMiddleware);
    app.use(requestMetricsMiddleware);
    app.use(
      "/health",
      createHealthRouter({
        dbConnection: { readyState: 0 },
        redis: { isOpen: false, ping: async () => "PONG" },
      })
    );
    app.get("/api/users/:id", (req, res) => res.json({ ok: true }));
    app.get("/api/fail/:id", (req, res, next) => {
      const error = new Error("sensitive error text");
      error.statusCode = 500;
      next(error);
    });
    app.use(require("../middleware/errorMiddleware"));
    app.get("/metrics", require("../monitoring/metrics").metricsAuth,
      require("../monitoring/metrics").metricsHandler);

    await withServer(app, async (port) => {
      const liveResponse = await makeRequest(port, "/health/live");
      assert.strictEqual(liveResponse.statusCode, 200, "Liveness responds while dependencies are down");

      const notReadyResponse = await makeRequest(port, "/health/ready");
      assert.strictEqual(notReadyResponse.statusCode, 503, "Readiness fails when dependencies are unavailable");
      assert.deepStrictEqual(JSON.parse(notReadyResponse.body).checks, {
        mongodb: "unavailable",
        redis: "unavailable",
      });

      const readyRouter = createHealthRouter({
        dbConnection: {
          readyState: 1,
          db: { admin: () => ({ ping: async () => ({ ok: 1 }) }) },
        },
        redis: { isOpen: true, ping: async () => "PONG" },
      });
      const readyApp = express();
      readyApp.use("/health", readyRouter);
      await withServer(readyApp, async (readyPort) => {
        const readyResponse = await makeRequest(readyPort, "/health/ready");
        assert.strictEqual(readyResponse.statusCode, 200, "Readiness succeeds when MongoDB and Redis respond");
      });

      const redisFailureApp = express();
      redisFailureApp.use(
        "/health",
        createHealthRouter({
          dbConnection: {
            readyState: 1,
            db: { admin: () => ({ ping: async () => ({ ok: 1 }) }) },
          },
          redis: {
            isOpen: true,
            ping: async () => {
              throw new Error("private redis connection details");
            },
          },
        })
      );
      await withServer(redisFailureApp, async (redisFailurePort) => {
        const redisFailureResponse = await makeRequest(redisFailurePort, "/health/ready");
        assert.strictEqual(redisFailureResponse.statusCode, 503, "Readiness fails when Redis ping fails");
        assert.strictEqual(
          JSON.parse(redisFailureResponse.body).checks.redis,
          "unavailable"
        );
      });

      const mongoFailureApp = express();
      mongoFailureApp.use(
        "/health",
        createHealthRouter({
          dbConnection: {
            readyState: 1,
            db: {
              admin: () => ({
                ping: async () => {
                  throw new Error("private MongoDB connection details");
                },
              }),
            },
          },
          redis: { isOpen: true, ping: async () => "PONG" },
        })
      );
      await withServer(mongoFailureApp, async (mongoFailurePort) => {
        const mongoFailureResponse = await makeRequest(mongoFailurePort, "/health/ready");
        assert.strictEqual(mongoFailureResponse.statusCode, 503, "Readiness fails when MongoDB ping fails");
        assert.strictEqual(
          JSON.parse(mongoFailureResponse.body).checks.mongodb,
          "unavailable"
        );
      });

      process.env.METRICS_TOKEN = "";
      const unconfiguredMetrics = await makeRequest(port, "/metrics");
      assert.strictEqual(unconfiguredMetrics.statusCode, 503, "Metrics fail closed without a configured token");

      process.env.METRICS_TOKEN = "test-secret-token";
      const unauthorizedMetrics = await makeRequest(port, "/metrics");
      assert.strictEqual(unauthorizedMetrics.statusCode, 401, "Metrics reject missing credentials");
      const wrongTokenMetrics = await makeRequest(port, "/metrics", {
        authorization: "Bearer wrong-token",
      });
      assert.strictEqual(wrongTokenMetrics.statusCode, 401, "Metrics reject an invalid bearer token");

      const privatePath = "/api/users/jane@example.test?token=query-secret&password=pw-secret";
      const apiResponse = await makeRequest(port, privatePath);
      assert.strictEqual(apiResponse.statusCode, 200, "Parameterized API route remains available");

      const metricsResponse = await makeRequest(port, "/metrics", {
        authorization: "Bearer test-secret-token",
      });
      assert.strictEqual(metricsResponse.statusCode, 200, "Valid bearer token grants metrics access");
      assert.match(
        metricsResponse.headers["content-type"],
        /text\/plain/,
        "Metrics use the Prometheus exposition content type"
      );
      assert.match(metricsResponse.body, /nodejs_version_info/, "Default Node.js metrics are exposed");
      assert.match(
        metricsResponse.body,
        /http_requests_total\{method="GET",route="\/api\/users\/:id",status_code="2xx"\} 1/,
        "HTTP counters use the Express route template and bounded status class"
      );
      assert.doesNotMatch(metricsResponse.body, /jane@example\.test|query-secret|pw-secret/);
      assert.match(metricsResponse.body, /http_request_duration_seconds_bucket/);

      const errorResponse = await makeRequest(port, "/api/fail/private-person?auth=private");
      assert.strictEqual(errorResponse.statusCode, 500, "Error endpoint uses shared error handling");

      const logText = JSON.stringify(capturedLogs);
      assert.match(logText, /\/api\/users\/:id/, "Request logs use route templates");
      assert.doesNotMatch(
        logText,
        /jane@example\.test|query-secret|pw-secret|private-person|sensitive error text|auth=private/,
        "Request and error logs omit personal data, query strings, and exception text"
      );

      const metricsAfterScrape = await register.metrics();
      assert.doesNotMatch(
        metricsAfterScrape,
        /route="\/metrics"/,
        "Metrics endpoint scrapes are excluded from request series"
      );
    });

    console.log("Monitoring integration tests passed.");
  } finally {
    logger.info = originalInfo;
    logger.warn = originalWarn;
    if (originalToken === undefined) {
      delete process.env.METRICS_TOKEN;
    } else {
      process.env.METRICS_TOKEN = originalToken;
    }
  }
}

runTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
