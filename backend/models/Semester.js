const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    number: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    academicYear: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["UPCOMING", "ACTIVE", "COMPLETED"],
      default: "UPCOMING",
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
  { timestamps: true }
);

semesterSchema.index({ number: 1, academicYear: 1 });

module.exports = mongoose.model("Semester", semesterSchema);