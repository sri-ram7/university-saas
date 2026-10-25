const CourseOffering = require("../models/CourseOffering");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createCourseOffering = async (data) => {
  return await CourseOffering.create(data);
};

exports.getCourseOfferings = async (query = {}) => {
  const features = new APIFeatures(
    CourseOffering.find({ isDeleted: { $ne: true } })
      .populate("course")
      .populate("faculty")
      .populate("semester")
      .populate("section")
      .populate("batch"),
    query
  ).paginateIfRequested();

  return await features.query.lean();
};

exports.getCourseOfferingById = async (id) => {
  const offering = await CourseOffering.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("course")
    .populate("faculty")
    .populate("semester")
    .populate("section")
    .populate("batch")
    .lean();

  if (!offering) {
    throw new ApiError(404, "Course offering not found");
  }

  return offering;
};

exports.updateCourseOffering = async (id, data) => {
  const offering = await CourseOffering.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("course")
    .populate("faculty")
    .populate("semester")
    .populate("section")
    .populate("batch");

  if (!offering) {
    throw new ApiError(404, "Course offering not found");
  }

  return offering;
};

exports.deleteCourseOffering = async (id) => {
  const offering = await softDelete(CourseOffering, id);

  if (!offering) {
    throw new ApiError(404, "Course offering not found");
  }

  return offering;
};