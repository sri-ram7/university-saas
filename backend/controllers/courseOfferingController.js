const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const service = require("../services/courseOfferingService");

exports.createCourseOffering = asyncHandler(async (req, res) => {
  const offering = await service.createCourseOffering(req.body);

  res.status(201).json(
    new ApiResponse(201, offering, "Course Offering created")
  );
});

exports.getCourseOfferings = asyncHandler(async (req, res) => {
  const offerings = await service.getCourseOfferings(req.query);

  res.status(200).json(
    new ApiResponse(200, offerings, "Course Offerings fetched")
  );
});

exports.getCourseOfferingById = asyncHandler(async (req, res) => {
  const offering = await service.getCourseOfferingById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, offering, "Course Offering fetched successfully")
  );
});

exports.updateCourseOffering = asyncHandler(async (req, res) => {
  const offering = await service.updateCourseOffering(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, offering, "Course Offering updated successfully")
  );
});

exports.deleteCourseOffering = asyncHandler(async (req, res) => {
  await service.deleteCourseOffering(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Course Offering deleted successfully")
  );
});