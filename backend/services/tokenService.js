const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { redisClient } = require("../config/redis");

const REFRESH_TOKEN_EXPIRY = "7d";
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * SHA-256 hash helper for storing secure token identifiers rather than raw tokens.
 */
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Generate Access Token (short-lived)
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.EXPIRE_IN || "15m",
    }
  );
};

/**
 * Generate Refresh Token (long-lived) with Family ID and Nonce
 */
const generateRefreshToken = (user, familyId) => {
  const nonce = crypto.randomUUID();
  return jwt.sign(
    {
      id: user._id,
      familyId,
      nonce,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
};

/**
 * Store/update session state in Redis and MongoDB
 */
const saveSession = async (userId, familyId, rawRefreshToken) => {
  const hashedToken = hashToken(rawRefreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

  // 1. Save in Redis if connected
  if (redisClient.isOpen) {
    try {
      const sessionKey = `session:active:${familyId}`;
      await redisClient.set(
        sessionKey,
        JSON.stringify({
          userId: userId.toString(),
          familyId,
          hashedToken,
          expiresAt: expiresAt.toISOString(),
        }),
        { EX: REFRESH_TOKEN_TTL_SECONDS }
      );
    } catch (err) {
      console.error("Redis session save error:", err.message);
    }
  }

  // 2. Persist in MongoDB
  const user = await User.findById(userId);
  if (user) {
    if (!user.refreshSessions) {
      user.refreshSessions = [];
    }

    const existingIndex = user.refreshSessions.findIndex((s) => s.familyId === familyId);
    if (existingIndex > -1) {
      user.refreshSessions[existingIndex].hashedToken = hashedToken;
      user.refreshSessions[existingIndex].expiresAt = expiresAt;
      user.refreshSessions[existingIndex].isRevoked = false;
    } else {
      user.refreshSessions.push({
        familyId,
        hashedToken,
        expiresAt,
        isRevoked: false,
      });
    }

    user.refreshToken = rawRefreshToken; // Backward compatibility field
    await user.save();
  }
};

/**
 * Mark an entire session family as revoked in Redis & Mongo
 */
const revokeSessionFamily = async (userId, familyId) => {
  // 1. Mark revoked in Redis
  if (redisClient.isOpen) {
    try {
      await redisClient.set(`session:revoked:${familyId}`, "1", { EX: REFRESH_TOKEN_TTL_SECONDS });
      await redisClient.del(`session:active:${familyId}`);
    } catch (err) {
      console.error("Redis revoke family error:", err.message);
    }
  }

  // 2. Mark revoked in MongoDB
  if (userId) {
    await User.updateOne(
      { _id: userId, "refreshSessions.familyId": familyId },
      { $set: { "refreshSessions.$.isRevoked": true, refreshToken: null } }
    );
  } else {
    await User.updateOne(
      { "refreshSessions.familyId": familyId },
      { $set: { "refreshSessions.$.isRevoked": true, refreshToken: null } }
    );
  }
};

/**
 * Check if a session family is revoked
 */
const isFamilyRevoked = async (user, familyId) => {
  // Check Redis
  if (redisClient.isOpen) {
    try {
      const isRevokedInRedis = await redisClient.get(`session:revoked:${familyId}`);
      if (isRevokedInRedis === "1") return true;
    } catch (err) {
      console.error("Redis check revoked error:", err.message);
    }
  }

  // Check MongoDB
  if (user && user.refreshSessions) {
    const session = user.refreshSessions.find((s) => s.familyId === familyId);
    if (session && session.isRevoked) {
      return true;
    }
  }

  return false;
};

/**
 * Check if a token hash has already been used (Rotated out)
 */
const isTokenUsed = async (hashedToken) => {
  if (redisClient.isOpen) {
    try {
      const usedInRedis = await redisClient.get(`session:used:${hashedToken}`);
      if (usedInRedis === "1") return true;
    } catch (err) {
      console.error("Redis check used token error:", err.message);
    }
  }
  return false;
};

/**
 * Mark a token hash as used in Redis
 */
const markTokenAsUsed = async (hashedToken) => {
  if (redisClient.isOpen) {
    try {
      await redisClient.set(`session:used:${hashedToken}`, "1", { EX: REFRESH_TOKEN_TTL_SECONDS });
    } catch (err) {
      console.error("Redis mark token used error:", err.message);
    }
  }
};

/**
 * Verify refresh token, perform Reuse Detection, and Rotate Tokens
 */
const verifyAndRotateRefreshToken = async (rawRefreshToken) => {
  if (!rawRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  let decoded;
  try {
    decoded = jwt.verify(rawRefreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const { id: userId, familyId } = decoded;
  if (!userId || !familyId) {
    throw new ApiError(401, "Malformed refresh token claims");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const currentHashedToken = hashToken(rawRefreshToken);

  // 1. Check if the session family has already been revoked
  const revoked = await isFamilyRevoked(user, familyId);
  if (revoked) {
    throw new ApiError(401, "Session has been revoked. Please log in again.");
  }

  // 2. Check for REUSE DETECTED (attempt to reuse an already rotated token)
  const used = await isTokenUsed(currentHashedToken);
  if (used) {
    // 🚨 SUSPICIOUS REUSE DETECTED! Revoke entire session family to isolate breach.
    await revokeSessionFamily(user._id, familyId);
    throw new ApiError(
      401,
      "Refresh token reuse detected. Session revoked. Please log in again."
    );
  }

  // 3. Verify that the provided token matches the active session token
  let activeHashedToken = null;

  if (redisClient.isOpen) {
    try {
      const activeSessionRaw = await redisClient.get(`session:active:${familyId}`);
      if (activeSessionRaw) {
        const activeSession = JSON.parse(activeSessionRaw);
        activeHashedToken = activeSession.hashedToken;
      }
    } catch (err) {
      console.error("Redis active session check error:", err.message);
    }
  }

  if (!activeHashedToken && user.refreshSessions) {
    const mongoSession = user.refreshSessions.find((s) => s.familyId === familyId && !s.isRevoked);
    if (mongoSession) {
      activeHashedToken = mongoSession.hashedToken;
    }
  }

  // If token mismatch (e.g. old token presented when active token exists), trigger reuse detection
  if (activeHashedToken && activeHashedToken !== currentHashedToken) {
    await revokeSessionFamily(user._id, familyId);
    throw new ApiError(
      401,
      "Refresh token reuse detected. Session revoked. Please log in again."
    );
  }

  // 4. ROTATION EXECUTION
  // Mark current token as used
  await markTokenAsUsed(currentHashedToken);

  // Issue new Access Token and Rotated Refresh Token under same familyId
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user, familyId);

  // Save new session state
  await saveSession(user._id, familyId, newRefreshToken);

  return {
    user,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    familyId,
  };
};

/**
 * Create a new login session with a fresh familyId
 */
const createNewLoginSession = async (user) => {
  const familyId = crypto.randomUUID();
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, familyId);

  await saveSession(user._id, familyId, refreshToken);

  return {
    user,
    accessToken,
    refreshToken,
    familyId,
  };
};

/**
 * Revoke ALL session families for a user (e.g. after password reset)
 */
const revokeAllUserSessions = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  if (user.refreshSessions && user.refreshSessions.length > 0) {
    for (const session of user.refreshSessions) {
      session.isRevoked = true;
      if (redisClient.isOpen) {
        try {
          await redisClient.set(`session:revoked:${session.familyId}`, "1", { EX: REFRESH_TOKEN_TTL_SECONDS });
          await redisClient.del(`session:active:${session.familyId}`);
        } catch (err) {
          console.error("Redis revokeAll error:", err.message);
        }
      }
    }
  }

  user.refreshToken = null;
  await user.save();
};

module.exports = {
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  saveSession,
  revokeSessionFamily,
  revokeAllUserSessions,
  verifyAndRotateRefreshToken,
  createNewLoginSession,
};
