const winston = require("winston");

const SENSITIVE_KEYS = new Set([
  "password",
  "oldpassword",
  "newpassword",
  "confirmpassword",
  "token",
  "accesstoken",
  "refreshtoken",
  "rawtoken",
  "verificationtoken",
  "resetpasswordtoken",
  "otp",
  "code",
  "hashedotp",
  "cookie",
  "authorization",
  "x-auth-token",
  "apikey",
  "secret",
]);

/**
 * Deeply sanitize sensitive fields in object parameters, body, headers, or query
 */
const sanitizeData = (data) => {
  if (data === null || data === undefined) return data;
  if (typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// Configure Winston log level and formats
const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === "test" ? "error" : "info");

const customJsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const devFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, requestId, ...meta }) => {
    const reqIdStr = requestId ? `[${requestId}] ` : "";
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(sanitizeData(meta))}` : "";
    return `${timestamp} ${level}: ${reqIdStr}${message}${metaStr}`;
  })
);

const logger = winston.createLogger({
  level: logLevel,
  format: process.env.NODE_ENV === "production" ? customJsonFormat : devFormat,
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

module.exports = {
  logger,
  sanitizeData,
};
