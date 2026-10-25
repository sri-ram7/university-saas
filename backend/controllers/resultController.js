const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const resultService = require("../services/resultService");

exports.generateResult = asyncHandler(async (req, res) => {
  const result = await resultService.generateResult(req.body);

  res.status(201).json(
    new ApiResponse(201, result, "Result generated successfully")
  );
});

exports.getResults = asyncHandler(async (req, res) => {
  const results = await resultService.getResults(req.query);

  res.status(200).json(
    new ApiResponse(200, results, "Results fetched successfully")
  );
});