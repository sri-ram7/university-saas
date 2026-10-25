const crypto = require("crypto");
const promClient = require("prom-client");

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestsTotal = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of completed HTTP requests.",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const httpRequestDurationSeconds = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds.",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

const metricsAuth = (req, res, next) => {
  const configuredToken = process.env.METRICS_TOKEN;
  if (!configuredToken) {
    return res.status(503).json({ error: "Metrics endpoint is not configured" });
  }

  const authorization = req.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const suppliedHash = crypto
    .createHash("sha256")
    .update(match[1])
    .digest();
  const configuredHash = crypto
    .createHash("sha256")
    .update(configuredToken)
    .digest();

  if (!crypto.timingSafeEqual(suppliedHash, configuredHash)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return next();
};

const metricsHandler = async (req, res, next) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  httpRequestDurationSeconds,
  httpRequestsTotal,
  metricsAuth,
  metricsHandler,
  register,
};
