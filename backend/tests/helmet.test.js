process.chdir(require("path").resolve(__dirname, ".."));

const assert = require("assert");
const cors = require("cors");
const express = require("express");
const http = require("http");
const helmetMiddleware = require("../middleware/helmet");
const swaggerRoutes = require("../routes/swaggerRoutes");

const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const makeRequest = (port, path, method = "GET", headers = {}) =>
  new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method,
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

async function runTests() {
  const app = express();
  app.use(helmetMiddleware);
  app.use(cors({ origin: frontendOrigin, credentials: true }));
  app.get("/api/test", (req, res) => res.json({ ok: true }));
  app.use("/api/docs", swaggerRoutes);

  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  try {
    const port = server.address().port;
    const apiResponse = await makeRequest(port, "/api/test", "GET", {
      Origin: frontendOrigin,
    });
    const apiCsp = apiResponse.headers["content-security-policy"] || "";

    assert.strictEqual(apiResponse.statusCode, 200, "API responds successfully");
    assert.strictEqual(
      apiResponse.headers["access-control-allow-origin"],
      frontendOrigin,
      "Existing frontend CORS origin remains allowed"
    );
    assert.match(
      apiCsp,
      /script-src 'self'\s*(?:;|$)/,
      "API CSP restricts scripts to self"
    );
    assert.strictEqual(
      apiResponse.headers["x-content-type-options"],
      "nosniff",
      "X-Content-Type-Options is set"
    );
    assert.strictEqual(
      apiResponse.headers["x-frame-options"],
      "SAMEORIGIN",
      "X-Frame-Options is set"
    );
    assert.strictEqual(
      apiResponse.headers["strict-transport-security"],
      undefined,
      "HSTS is not enabled while HTTPS is not enforced"
    );
    assert.strictEqual(
      apiResponse.headers["x-powered-by"],
      undefined,
      "Express identification header is removed"
    );

    const preflightResponse = await makeRequest(port, "/api/test", "OPTIONS", {
      Origin: frontendOrigin,
      "Access-Control-Request-Method": "GET",
      "Access-Control-Request-Headers": "content-type",
    });
    assert.strictEqual(preflightResponse.statusCode, 204, "API CORS preflight succeeds");
    assert.strictEqual(
      preflightResponse.headers["access-control-allow-origin"],
      frontendOrigin,
      "CORS preflight continues to allow the configured frontend"
    );

    const swaggerResponse = await makeRequest(port, "/api/docs/");
    const swaggerCsp = swaggerResponse.headers["content-security-policy"] || "";

    assert.strictEqual(swaggerResponse.statusCode, 200, "Swagger UI remains accessible");
    assert.match(swaggerResponse.body, /swagger-ui/i, "Swagger UI HTML is served");
    assert.match(
      swaggerCsp,
      /script-src 'self' 'unsafe-inline'/,
      "Swagger CSP allows its inline initialization script"
    );
    assert.match(
      swaggerCsp,
      /style-src 'self' 'unsafe-inline'/,
      "Swagger CSP allows its inline styles"
    );
    assert.doesNotMatch(
      swaggerCsp,
      /upgrade-insecure-requests/,
      "CSP does not upgrade HTTP requests in the current HTTP deployment"
    );

    console.log("Helmet security header tests passed.");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

runTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
