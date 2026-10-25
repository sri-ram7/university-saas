const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const programService = require("../services/programService");

exports.createProgram = asyncHandler(async (req, res) => {
  const program = await programService.createProgram(req.body);

  res.status(201).json(
    new ApiResponse(201, program, "Program created")
  );
});

exports.getPrograms = asyncHandler(async (req, res) => {
  const programs = await programService.getPrograms(req.query);

  res.status(200).json(
    new ApiResponse(200, programs, "Programs fetched")
  );
});

exports.getProgramById = asyncHandler(async (req, res) => {
  const program = await programService.getProgramById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, program, "Program fetched successfully")
  );
});

exports.updateProgram = asyncHandler(async (req, res) => {
  const program = await programService.updateProgram(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, program, "Program updated successfully")
  );
});

exports.deleteProgram = asyncHandler(async (req, res) => {
  await programService.deleteProgram(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Program deleted successfully")
  );
});