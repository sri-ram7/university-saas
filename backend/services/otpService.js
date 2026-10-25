const crypto = require("crypto");
const ApiError = require("../utils/ApiError");
const { redisClient } = require("../config/redis");
const transporter = require("../utils/sendEmail");

const OTP_TTL_SECONDS = 300; // 5 minutes default
const OTP_COOLDOWN_SECONDS = 60; // 60 seconds default
const MAX_OTP_ATTEMPTS = 3;

// In-memory fallback stores for standalone test environment when Redis is offline
const memoryOtpStore = new Map();
const memoryAttemptsStore = new Map();
const memoryCooldownStore = new Map();
const memoryUsedStore = new Map();

/**
 * Generate a cryptographically secure 6-digit OTP string
 */
const generate6DigitOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * SHA-256 hash helper for storing secure OTP hashes rather than raw OTPs
 */
const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp.toString()).digest("hex");
};

/**
 * Build purpose-specific Redis keys
 */
const getOtpKey = (purpose, target) => `otp:${purpose}:${target}`;
const getAttemptsKey = (purpose, target) => `otp:attempts:${purpose}:${target}`;
const getCooldownKey = (purpose, target) => `otp:cooldown:${purpose}:${target}`;

/**
 * Send an OTP to user/target with resend cooldown check
 */
const sendOtp = async ({ target, purpose, userId = null, email = null }) => {
  if (!target || !purpose) {
    throw new ApiError(400, "Target and purpose are required");
  }

  const recipientEmail = email || target;
  const cooldownKey = getCooldownKey(purpose, target);
  const now = Date.now();

  // 1. Resend Cooldown Check (60 seconds)
  if (redisClient.isOpen) {
    try {
      const isCooldown = await redisClient.get(cooldownKey);
      if (isCooldown === "1") {
        throw new ApiError(429, "Please wait 60 seconds before requesting another OTP.");
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error("Redis cooldown check error:", err.message);
    }
  } else {
    const lastSent = memoryCooldownStore.get(cooldownKey);
    if (lastSent && now - lastSent < OTP_COOLDOWN_SECONDS * 1000) {
      throw new ApiError(429, "Please wait 60 seconds before requesting another OTP.");
    }
  }

  // 2. Generate raw OTP and compute SHA-256 hash
  const rawOtp = generate6DigitOtp();
  const hashedOtp = hashOtp(rawOtp);
  const otpKey = getOtpKey(purpose, target);
  const attemptsKey = getAttemptsKey(purpose, target);

  const otpData = {
    hashedOtp,
    userId,
    target,
    purpose,
    createdAt: now,
  };

  // 3. Store in Redis or Memory Fallback
  if (redisClient.isOpen) {
    try {
      await redisClient.set(otpKey, JSON.stringify(otpData), { EX: OTP_TTL_SECONDS });
      await redisClient.del(attemptsKey);
      await redisClient.set(cooldownKey, "1", { EX: OTP_COOLDOWN_SECONDS });
    } catch (err) {
      console.error("Redis OTP save error:", err.message);
    }
  } else {
    memoryOtpStore.set(otpKey, otpData);
    memoryAttemptsStore.delete(attemptsKey);
    memoryCooldownStore.set(cooldownKey, now);
  }

  // 4. Send Email via transporter
  if (process.env.EMAIL_USER && recipientEmail.includes("@")) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: `Your OTP Code for ${purpose}`,
        text: `Your 6-digit OTP code for ${purpose} is: ${rawOtp}. This code will expire in 5 minutes. Do not share this code with anyone.`,
      });
    } catch (mailErr) {
      console.error("Failed to send OTP email:", mailErr.message);
    }
  }

  return {
    success: true,
    message: "OTP sent successfully",
    rawOtp: process.env.NODE_ENV === "test" ? rawOtp : undefined, // Include rawOtp only in test environment for assertion
  };
};

/**
 * Verify an OTP with attempt limits and single-use deletion
 */
const verifyOtp = async ({ target, purpose, otp }) => {
  if (!target || !purpose || !otp) {
    throw new ApiError(400, "Target, purpose, and OTP code are required");
  }

  const hashedIncomingOtp = hashOtp(otp);
  const otpKey = getOtpKey(purpose, target);
  const attemptsKey = getAttemptsKey(purpose, target);

  // 1. Check if token was already used
  if (redisClient.isOpen) {
    try {
      const isUsed = await redisClient.get(`otp:used:${hashedIncomingOtp}`);
      if (isUsed === "1") {
        throw new ApiError(400, "OTP has already been used");
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
    }
  } else if (memoryUsedStore.get(`otp:used:${hashedIncomingOtp}`)) {
    throw new ApiError(400, "OTP has already been used");
  }

  // 2. Check failed attempt counter
  let currentAttempts = 0;
  if (redisClient.isOpen) {
    try {
      const attemptsStr = await redisClient.get(attemptsKey);
      currentAttempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;
    } catch (err) {
      console.error("Redis attempts read error:", err.message);
    }
  } else {
    currentAttempts = memoryAttemptsStore.get(attemptsKey) || 0;
  }

  if (currentAttempts >= MAX_OTP_ATTEMPTS) {
    // Delete OTP key once attempt limit exceeded
    if (redisClient.isOpen) {
      try {
        await redisClient.del(otpKey);
      } catch (err) {}
    } else {
      memoryOtpStore.delete(otpKey);
    }
    throw new ApiError(400, "Maximum OTP verification attempts exceeded. Please request a new OTP.");
  }

  // 3. Fetch stored OTP data
  let storedData = null;
  if (redisClient.isOpen) {
    try {
      const storedRaw = await redisClient.get(otpKey);
      if (storedRaw) {
        storedData = JSON.parse(storedRaw);
      }
    } catch (err) {
      console.error("Redis OTP read error:", err.message);
    }
  } else {
    storedData = memoryOtpStore.get(otpKey) || null;
  }

  if (!storedData) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // 4. Compare Hashed OTPs
  if (storedData.hashedOtp !== hashedIncomingOtp) {
    currentAttempts++;

    if (redisClient.isOpen) {
      try {
        await redisClient.incr(attemptsKey);
        await redisClient.expire(attemptsKey, OTP_TTL_SECONDS);
      } catch (err) {
        console.error("Redis attempts incr error:", err.message);
      }
    } else {
      memoryAttemptsStore.set(attemptsKey, currentAttempts);
    }

    if (currentAttempts >= MAX_OTP_ATTEMPTS) {
      if (redisClient.isOpen) {
        try {
          await redisClient.del(otpKey);
        } catch (err) {}
      } else {
        memoryOtpStore.delete(otpKey);
      }
      throw new ApiError(400, "Maximum OTP verification attempts exceeded. Please request a new OTP.");
    }

    const remainingAttempts = MAX_OTP_ATTEMPTS - currentAttempts;
    throw new ApiError(400, `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`);
  }

  // 5. Successful Verification ➔ Delete OTP and mark as used
  if (redisClient.isOpen) {
    try {
      await redisClient.del(otpKey);
      await redisClient.del(attemptsKey);
      await redisClient.set(`otp:used:${hashedIncomingOtp}`, "1", { EX: OTP_TTL_SECONDS });
    } catch (err) {
      console.error("Redis OTP cleanup error:", err.message);
    }
  } else {
    memoryOtpStore.delete(otpKey);
    memoryAttemptsStore.delete(attemptsKey);
    memoryUsedStore.set(`otp:used:${hashedIncomingOtp}`, true);
  }

  return {
    success: true,
    message: "OTP verified successfully",
    userId: storedData.userId,
    target: storedData.target,
    purpose: storedData.purpose,
  };
};

module.exports = {
  generate6DigitOtp,
  hashOtp,
  sendOtp,
  verifyOtp,
};
