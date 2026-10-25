const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const enrollmentService = require("../services/enrollmentService");

exports.createEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.createEnrollment(req.body);

  res.status(201).json(
    new ApiResponse(201, enrollment, "Enrollment created successfully")
  );
});

exports.getEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.getEnrollments(req.query);

  res.status(200).json(
    new ApiResponse(200, enrollments, "Enrollments fetched successfully")
  );
});

exports.getEnrollmentById = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.getEnrollmentById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, enrollment, "Enrollment fetched successfully")
  );
});

exports.updateEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.updateEnrollment(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, enrollment, "Enrollment updated successfully")
  );
});

exports.deleteEnrollment = asyncHandler(async (req, res) => {
  await enrollmentService.deleteEnrollment(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Enrollment deleted successfully")
  );
});