const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const batchService = require("../services/batchService");

exports.createBatch = asyncHandler(async (req, res) => {
  const batch = await batchService.createBatch(req.body);

  res.status(201).json(
    new ApiResponse(201, batch, "Batch created successfully")
  );
});

exports.getBatches = asyncHandler(async (req, res) => {
  const batches = await batchService.getBatches(req.query);

  res.status(200).json(
    new ApiResponse(200, batches, "Batches fetched successfully")
  );
});

exports.getBatchById = asyncHandler(async (req, res) => {
  const batch = await batchService.getBatchById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, batch, "Batch fetched successfully")
  );
});

exports.updateBatch = asyncHandler(async (req, res) => {
  const batch = await batchService.updateBatch(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, batch, "Batch updated successfully")
  );
});

exports.deleteBatch = asyncHandler(async (req, res) => {
  await batchService.deleteBatch(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Batch deleted successfully")
  );
});