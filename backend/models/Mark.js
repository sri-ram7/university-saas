const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    obtainedMarks: {
      type: Number,
      required: true,
    },

    remarks: {
      type: String,
      default: "",
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

markSchema.index(
  {
    student: 1,
    exam: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Mark", markSchema);