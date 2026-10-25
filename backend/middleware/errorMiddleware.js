const { logger } = require("../utils/logger");
const { getSafeMethod, getSafeRoute } = require("../utils/requestMetadata");

// Global Error Handler Middleware with Winston Logger Integration
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error(`[ERROR] ${getSafeMethod(req.method)} ${getSafeRoute(req)}`, {
    statusCode: statusCode,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
