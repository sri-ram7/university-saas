const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const courseService = require("../services/courseService");

exports.createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});

exports.getCourses = asyncHandler(async (req, res) => {
  const courses = await courseService.getCourses(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses fetched successfully"));
});

exports.getCourseById = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, course, "Course fetched successfully"));
});

exports.updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, course, "Course updated successfully"));
});

exports.deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Course deleted successfully"));
});