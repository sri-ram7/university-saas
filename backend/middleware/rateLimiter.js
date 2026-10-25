const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { redisClient, connectRedis } = require("../config/redis");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Store factory for express-rate-limit.
 * Uses RedisStore with existing redisClient for multi-container shared rate limiting.
 * Falls back cleanly to MemoryStore in test environments if Redis is unavailable.
 */
const createStore = (prefix) => {
  if (process.env.NODE_ENV === "test" && !redisClient.isOpen) {
    return undefined; // Default to MemoryStore in test mode when Redis is offline
  }

  return new RedisStore({
    sendCommand: async (...args) => {
      if (!redisClient.isOpen) {
        await connectRedis();
      }
      return redisClient.sendCommand(args);
    },
    prefix,
  });
};

const globalWindowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000; // 15 minutes default
const globalMaxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100; // 100 requests per 15 min default

const authWindowMs = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000; // 15 minutes default
const authMaxRequests = parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS, 10) || 5; // 5 requests per 15 min default

/**
 * Global API rate limiter applied across all /api routes.
 * Skips Swagger API documentation routes (/api/docs).
 */
const globalRateLimiter = rateLimit({
  windowMs: globalWindowMs,
  max: globalMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: true,
  store: createStore("rl:global:"),
  message: "Too many requests from this IP, please try again later.",
  skip: (req) => Boolean(req.originalUrl && req.originalUrl.startsWith("/api/docs")),
  handler: (req, res, next, options) => {
    res.status(429).json(new ApiResponse(429, options.message));
  },
});

/**
 * Stricter rate limiter specifically for auth & sensitive endpoints
 * (login, register, forgot-password, reset-password, OTP verification).
 */
const authRateLimiter = rateLimit({
  windowMs: authWindowMs,
  max: authMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: true,
  store: createStore("rl:auth:"),
  message: "Too many requests to authentication endpoints, please try again later.",
  handler: (req, res, next, options) => {
    res.status(429).json(new ApiResponse(429, options.message));
  },
});

module.exports = {
  globalRateLimiter,
  authRateLimiter,
};
