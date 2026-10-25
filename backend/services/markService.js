const Mark = require("../models/Mark");
const Student = require("../models/Student");
const Exam = require("../models/Exam");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createMark = async (data) => {
  const student = await Student.exists({ _id: data.student });

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const exam = await Exam.findById(data.exam)
    .select("totalMarks")
    .lean();

  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  if (data.obtainedMarks > exam.totalMarks) {
    throw new ApiError(
      400,
      "Obtained marks cannot exceed total marks"
    );
  }

  return await Mark.create(data);
};

exports.getMarks = async (query = {}) => {
  const features = new APIFeatures(
    Mark.find({ isDeleted: { $ne: true } })
      .populate("student")
      .populate({
        path: "exam",
        populate: {
          path: "courseOffering",
          populate: {
            path: "course",
          },
        },
      }),
    query
  ).paginateIfRequested();

  return await features.query.lean();
};

exports.getMarkById = async (id) => {
  const mark = await Mark.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("student")
    .populate({
      path: "exam",
      populate: {
        path: "courseOffering",
        populate: {
          path: "course",
        },
      },
    })
    .lean();

  if (!mark) {
    throw new ApiError(404, "Mark not found");
  }

  return mark;
};

exports.updateMark = async (id, data) => {
  if (data.obtainedMarks !== undefined) {
    const existing = await Mark.findById(id);
    if (!existing) {
      throw new ApiError(404, "Mark not found");
    }
    const examId = data.exam || existing.exam;
    const exam = await Exam.findById(examId).select("totalMarks").lean();
    if (exam && data.obtainedMarks > exam.totalMarks) {
      throw new ApiError(400, "Obtained marks cannot exceed total marks");
    }
  }

  const mark = await Mark.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("student")
    .populate("exam");

  if (!mark) {
    throw new ApiError(404, "Mark not found");
  }

  return mark;
};

exports.deleteMark = async (id) => {
  const mark = await softDelete(Mark, id);

  if (!mark) {
    throw new ApiError(404, "Mark not found");
  }

  return mark;
};