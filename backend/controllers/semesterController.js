const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const semesterService = require("../services/semesterService");

exports.createSemester = asyncHandler(async (req, res) => {
  const semester = await semesterService.createSemester(req.body);

  res.status(201).json(
    new ApiResponse(201, semester, "Semester created")
  );
});

exports.getSemesters = asyncHandler(async (req, res) => {
  const semesters = await semesterService.getSemesters(req.query);

  res.status(200).json(
    new ApiResponse(200, semesters, "Semesters fetched")
  );
});

exports.getSemesterById = asyncHandler(async (req, res) => {
  const semester = await semesterService.getSemesterById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, semester, "Semester fetched successfully")
  );
});

exports.updateSemester = asyncHandler(async (req, res) => {
  const semester = await semesterService.updateSemester(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, semester, "Semester updated successfully")
  );
});

exports.deleteSemester = asyncHandler(async (req, res) => {
  await semesterService.deleteSemester(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Semester deleted successfully")
  );
});