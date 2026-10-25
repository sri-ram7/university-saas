const { logger } = require("../utils/logger");
const { getSafeMethod, getSafeRoute } = require("../utils/requestMetadata");

/**
 * Middleware to log HTTP request completion details and warn on slow responses.
 */
module.exports = (req, res, next) => {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6;
    const roundedMs = Number(durationMs.toFixed(2));
    const slowThresholdMs = Number(process.env.SLOW_REQUEST_THRESHOLD_MS || 1000);

    const logMeta = {
      method: getSafeMethod(req.method),
      route: getSafeRoute(req),
      statusCode: res.statusCode,
      responseTimeMs: roundedMs,
    };
    if (
      typeof req.id === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(req.id)
    ) {
      logMeta.requestId = req.id;
    }

    // Log request completion
    logger.info(
      `[HTTP] ${logMeta.method} ${logMeta.route} ${res.statusCode} - ${roundedMs}ms`,
      logMeta
    );

    // Warn if response duration exceeds slow request threshold
    if (roundedMs >= slowThresholdMs) {
      logger.warn(
        `[SLOW REQUEST] ${logMeta.method} ${logMeta.route} took ${roundedMs}ms (threshold: ${slowThresholdMs}ms)`,
        {
          ...logMeta,
          thresholdMs: slowThresholdMs,
        }
      );
    }
  });

  next();
};
