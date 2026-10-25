const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const uploadService = require("../services/uploadService");

exports.uploadFile = asyncHandler(async (req, res) => {
  const file = await uploadService.uploadFile(req.file);

  res.status(200).json(
    new ApiResponse(200, file, "File uploaded successfully")
  );
});