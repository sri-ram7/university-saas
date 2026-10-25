

const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["INTERNAL", "MID", "PRACTICAL", "EXTERNAL"],
      required: true,
    },

    courseOffering: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseOffering",
      required: true,
    },

    examDate: {
      type: Date,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    passingMarks: {
      type: Number,
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

module.exports = mongoose.model("Exam", examSchema);