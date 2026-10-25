const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const crypto = require("crypto");
const transporter = require("../utils/sendEmail");

const tokenService = require("./tokenService");

const register = async ({ name, email, password, role }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = tokenService.hashToken(rawToken);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified: false,
        isVerified: false,
        verificationToken: hashedToken,
    });

    if (redisClient.isOpen) {
        try {
            await redisClient.set(
                `emailverify:${hashedToken}`,
                JSON.stringify({ userId: user._id.toString(), email: user.email }),
                { EX: 86400 }
            );
        } catch (err) {
            console.error("Redis emailverify error:", err.message);
        }
    }

    const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email/${rawToken}`;
    if (process.env.EMAIL_USER) {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Verify Your Email Address",
                text: `Thank you for registering. Please click the link to verify your email: ${verifyUrl}`,
            });
        } catch (mailErr) {
            console.error("Failed to send verification email:", mailErr.message);
        }
    }

    return user;
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(400, "Invalid email or password");
    }

    if (!user.isVerified && !user.emailVerified) {
        throw new ApiError(403, "Please verify your email address to access the platform");
    }

    const { accessToken, refreshToken, familyId } = await tokenService.createNewLoginSession(user);

    return { user, accessToken, refreshToken, familyId };
};

const refreshToken = async (rawRefreshToken) => {
    return await tokenService.verifyAndRotateRefreshToken(rawRefreshToken);
};

const logout = async (userId, rawRefreshToken) => {
    if (rawRefreshToken) {
        try {
            const decoded = jwt.decode(rawRefreshToken);
            if (decoded && decoded.familyId) {
                await tokenService.revokeSessionFamily(userId, decoded.familyId);
                return;
            }
        } catch (e) {
            // Ignore decode error and fall back to clearing User.refreshToken
        }
    }
    await User.findByIdAndUpdate(userId, {
        refreshToken: null,
    });
};

const verifyEmail = async (rawToken) => {
    if (!rawToken) {
        throw new ApiError(400, "Verification token is required");
    }

    const hashedToken = tokenService.hashToken(rawToken);

    // 1. Check for token reuse
    if (redisClient.isOpen) {
        try {
            const isUsed = await redisClient.get(`emailverify:used:${hashedToken}`);
            if (isUsed === "1") {
                throw new ApiError(400, "Verification token has already been used");
            }
        } catch (err) {
            if (err instanceof ApiError) throw err;
        }
    }

    // 2. Find user from Redis or MongoDB
    let user = null;
    if (redisClient.isOpen) {
        try {
            const cachedData = await redisClient.get(`emailverify:${hashedToken}`);
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                user = await User.findById(parsed.userId);
            }
        } catch (err) {
            console.error("Redis lookup error:", err.message);
        }
    }

    if (!user) {
        user = await User.findOne({ verificationToken: hashedToken });
    }

    if (!user) {
        throw new ApiError(400, "Invalid or expired verification token");
    }

    if (user.emailVerified && user.isVerified) {
        return { message: "Email is already verified" };
    }

    // 3. Mark user as verified
    user.emailVerified = true;
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // 4. Invalidate token and mark as used
    if (redisClient.isOpen) {
        try {
            await redisClient.del(`emailverify:${hashedToken}`);
            await redisClient.set(`emailverify:used:${hashedToken}`, "1", { EX: 86400 });
        } catch (err) {
            console.error("Redis token cleanup error:", err.message);
        }
    }

    return { message: "Email verified successfully" };
};

const resendCooldownMap = new Map();

const resendVerification = async (email) => {
    const genericResponse = {
        message: "If an unverified account with that email exists, a verification link has been sent.",
    };

    const user = await User.findOne({ email });
    if (!user) {
        return genericResponse;
    }

    if (user.emailVerified || user.isVerified) {
        return { message: "Email is already verified" };
    }

    // Cooldown check (60 seconds)
    const now = Date.now();
    const lastResend = resendCooldownMap.get(user._id.toString());
    if (lastResend && now - lastResend < 60000) {
        throw new ApiError(429, "Please wait 60 seconds before requesting another verification email.");
    }

    if (redisClient.isOpen) {
        try {
            const isCooldown = await redisClient.get(`emailverify:cooldown:${user._id}`);
            if (isCooldown === "1") {
                throw new ApiError(429, "Please wait 60 seconds before requesting another verification email.");
            }
            await redisClient.set(`emailverify:cooldown:${user._id}`, "1", { EX: 60 });
        } catch (err) {
            if (err instanceof ApiError) throw err;
            console.error("Redis cooldown check error:", err.message);
        }
    } else {
        resendCooldownMap.set(user._id.toString(), now);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = tokenService.hashToken(rawToken);

    user.verificationToken = hashedToken;
    await user.save();

    if (redisClient.isOpen) {
        try {
            await redisClient.set(
                `emailverify:${hashedToken}`,
                JSON.stringify({ userId: user._id.toString(), email: user.email }),
                { EX: 86400 }
            );
        } catch (err) {
            console.error("Redis resend save error:", err.message);
        }
    }

    const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email/${rawToken}`;
    if (process.env.EMAIL_USER) {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Verify Your Email Address",
                text: `Please click the link to verify your email address: ${verifyUrl}`,
            });
        } catch (mailErr) {
            console.error("Failed to send resend email:", mailErr.message);
        }
    }

    return genericResponse;
};

const { hashPassword } = require("../utils/hashPassword");
const { redisClient } = require("../config/redis");

const forgotPassword = async (email) => {
  const genericResponse = {
    message: "If an account with that email exists, a password reset link has been sent.",
  };

  const user = await User.findOne({ email });
  if (!user) {
    // Return generic response to prevent account enumeration
    return genericResponse;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = tokenService.hashToken(rawToken);
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // 1. Save in Redis with TTL 600s
  if (redisClient.isOpen) {
    try {
      await redisClient.set(
        `pwdreset:${hashedToken}`,
        JSON.stringify({ userId: user._id.toString(), email: user.email }),
        { EX: 600 }
      );
    } catch (err) {
      console.error("Redis pwdreset save error:", err.message);
    }
  }

  // 2. Save in MongoDB
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = expiresAt;
  await user.save();

  // 3. Send Email
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${rawToken}`;
  if (process.env.EMAIL_USER) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Request",
        text: `You requested a password reset. Please click the link to reset your password: ${resetUrl}`,
      });
    } catch (mailErr) {
      console.error("Failed to send reset email:", mailErr.message);
    }
  }

  return genericResponse;
};

const resetPassword = async (rawToken, newPassword) => {
  if (!rawToken || !newPassword) {
    throw new ApiError(400, "Reset token and new password are required");
  }

  const hashedToken = tokenService.hashToken(rawToken);

  // 1. Check for token reuse (if marked as used in Redis)
  if (redisClient.isOpen) {
    try {
      const isUsed = await redisClient.get(`pwdreset:used:${hashedToken}`);
      if (isUsed === "1") {
        throw new ApiError(400, "Reset token has already been used");
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
    }
  }

  // 2. Find user from Redis or MongoDB
  let user = null;
  if (redisClient.isOpen) {
    try {
      const cachedData = await redisClient.get(`pwdreset:${hashedToken}`);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        user = await User.findById(parsed.userId);
      }
    } catch (err) {
      console.error("Redis pwdreset lookup error:", err.message);
    }
  }

  if (!user) {
    user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  // 3. Update password securely using hashPassword
  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  // 4. Invalidate token in Redis and mark as used
  if (redisClient.isOpen) {
    try {
      await redisClient.del(`pwdreset:${hashedToken}`);
      await redisClient.set(`pwdreset:used:${hashedToken}`, "1", { EX: 600 });
    } catch (err) {
      console.error("Redis token cleanup error:", err.message);
    }
  }

  // 5. Revoke ALL existing active sessions across all devices for this user
  await tokenService.revokeAllUserSessions(user._id);

  return { message: "Password updated successfully. All active sessions have been logged out." };
};

const otpService = require("./otpService");

const sendOtp = async (payload) => {
  return await otpService.sendOtp(payload);
};

const verifyOtp = async (payload) => {
  return await otpService.verifyOtp(payload);
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    sendOtp,
    verifyOtp,
};