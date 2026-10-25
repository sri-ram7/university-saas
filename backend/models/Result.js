const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },

    sgpa: {
      type: Number,
      required: true,
    },

    cgpa: {
      type: Number,
      required: true,
    },

    totalCredits: {
      type: Number,
      required: true,
    },

    earnedCredits: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PASS", "FAIL"],
      required: true,
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

resultSchema.index(
  {
    student: 1,
    semester: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Result", resultSchema);