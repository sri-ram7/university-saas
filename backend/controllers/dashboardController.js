const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const dashboardService = require("../services/dashboardService");

exports.getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getDashboard();

  res.status(200).json(
    new ApiResponse(
      200,
      dashboard,
      "Dashboard fetched successfully"
    )
  );
});