const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "faculty", "student"],
      default: "student",
    },

    universityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    refreshToken: {
      type: String,
    },

    refreshSessions: [
      {
        familyId: { type: String, required: true },
        hashedToken: { type: String, required: true },
        isRevoked: { type: Boolean, default: false },
        expiresAt: { type: Date, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    emailVerified: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);