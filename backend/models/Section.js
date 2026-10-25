
const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    // students: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Student",
    //   },
    // ],

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

module.exports = mongoose.model("Section", sectionSchema);