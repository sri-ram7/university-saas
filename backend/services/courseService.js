const Course = require("../models/Course");
const Department = require("../models/Department");
const Faculty = require("../models/Faculty");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createCourse = async (data) => {
  const exists = await Course.findOne({ code: data.code });

  if (exists) {
    throw new ApiError(400, "Course already exists");
  }

  const department = await Department.findById(data.department);

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  const faculty = await Faculty.findById(data.faculty);

  if (!faculty) {
    throw new ApiError(404, "Faculty not found");
  }

  return await Course.create(data);
};

exports.getCourses = async (query = {}) => {
  const features = new APIFeatures(
    Course.find({ isDeleted: { $ne: true } }).populate("department").populate("faculty"),
    query
  )
    .search(["name", "code"])
    .filter()
    .sort()
    .paginate();

  return await features.query.lean();
};

exports.getCourseById = async (id) => {
  const course = await Course.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("department")
    .populate("faculty")
    .lean();

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  return course;
};

exports.updateCourse = async (id, data) => {
  const course = await Course.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("department")
    .populate("faculty");

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  return course;
};  

exports.deleteCourse = async (id) => {
  const course = await softDelete(Course, id);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  return course;
};