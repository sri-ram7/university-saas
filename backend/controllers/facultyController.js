const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const facultyService = require("../services/facultyService");

exports.createFaculty = asyncHandler(async (req, res) => {
  const faculty = await facultyService.createFaculty(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, faculty, "Faculty created successfully"));
});

exports.getFaculties = asyncHandler(async (req, res) => {
  const faculties = await facultyService.getFaculties(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, faculties, "Faculties fetched successfully"));
});

exports.getFacultyById = asyncHandler(async (req, res) => {
  const faculty = await facultyService.getFacultyById(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, faculty, "Faculty fetched successfully"));
});

exports.updateFaculty = asyncHandler(async (req, res) => {
  const faculty = await facultyService.updateFaculty(req.params.id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, faculty, "Faculty updated successfully"));
});

exports.deleteFaculty = asyncHandler(async (req, res) => {
  await facultyService.deleteFaculty(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Faculty deleted successfully"));
});