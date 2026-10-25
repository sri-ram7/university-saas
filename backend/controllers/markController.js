const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const markService = require("../services/markService");

exports.createMark = asyncHandler(async (req, res) => {
  const mark = await markService.createMark(req.body);

  res.status(201).json(
    new ApiResponse(201, mark, "Marks added successfully")
  );
});

exports.getMarks = asyncHandler(async (req, res) => {
  const marks = await markService.getMarks(req.query);

  res.status(200).json(
    new ApiResponse(200, marks, "Marks fetched successfully")
  );
});

exports.getMarkById = asyncHandler(async (req, res) => {
  const mark = await markService.getMarkById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, mark, "Mark fetched successfully")
  );
});

exports.updateMark = asyncHandler(async (req, res) => {
  const mark = await markService.updateMark(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, mark, "Mark updated successfully")
  );
});

exports.deleteMark = asyncHandler(async (req, res) => {
  await markService.deleteMark(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Mark deleted successfully")
  );
});