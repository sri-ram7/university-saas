const Exam = require("../models/Exam");
const CourseOffering = require("../models/CourseOffering");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createExam = async (data) => {
  const offering = await CourseOffering.exists({ _id: data.courseOffering });

  if (!offering) {
    throw new ApiError(404, "Course Offering not found");
  }

  return await Exam.create(data);
};

exports.getExams = async (query = {}) => {
  const features = new APIFeatures(
    Exam.find({ isDeleted: { $ne: true } }).populate({
      path: "courseOffering",
      populate: [
        { path: "course" },
        { path: "faculty" },
        { path: "section" },
      ],
    }),
    query
  ).paginateIfRequested();

  return await features.query.lean();
};

exports.getExamById = async (id) => {
  const exam = await Exam.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate({
      path: "courseOffering",
      populate: [
        { path: "course" },
        { path: "faculty" },
        { path: "section" },
      ],
    })
    .lean();

  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  return exam;
};

exports.updateExam = async (id, data) => {
  if (data.courseOffering) {
    const offering = await CourseOffering.exists({ _id: data.courseOffering });
    if (!offering) {
      throw new ApiError(404, "Course Offering not found");
    }
  }

  const exam = await Exam.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("courseOffering");

  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  return exam;
};

exports.deleteExam = async (id) => {
  const exam = await softDelete(Exam, id);

  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  return exam;
};