const crypto = require("crypto");

/**
 * Middleware to ensure every incoming HTTP request has a unique requestId.
 * Reuses incoming X-Request-ID header if present, otherwise generates a UUID.
 * Propagates requestId onto req.id and the X-Request-ID response header.
 */
module.exports = (req, res, next) => {
  const existingId = req.headers["x-request-id"];
  const requestId = existingId || crypto.randomUUID();

  req.id = requestId;
  res.setHeader("X-Request-ID", requestId);

  next();
};
