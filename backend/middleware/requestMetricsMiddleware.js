const {
  getSafeMethod,
  getSafeRoute,
} = require("../utils/requestMetadata");
const {
  httpRequestDurationSeconds,
  httpRequestsTotal,
} = require("../monitoring/metrics");

module.exports = (req, res, next) => {
  if (req.path === "/metrics") {
    return next();
  }

  const startTime = process.hrtime.bigint();

  res.once("finish", () => {
    const labels = {
      method: getSafeMethod(req.method),
      route: getSafeRoute(req),
      status_code: `${Math.floor(res.statusCode / 100)}xx`,
    };
    const durationSeconds =
      Number(process.hrtime.bigint() - startTime) / 1e9;

    httpRequestsTotal.inc(labels);
    httpRequestDurationSeconds.observe(labels, durationSeconds);
  });

  return next();
};
