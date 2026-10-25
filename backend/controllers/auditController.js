const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const auditService = require("../services/auditService");

exports.getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await auditService.getAuditLogs(req.query);

  res.status(200).json(
    new ApiResponse(
      200,
      logs,
      "Audit logs fetched successfully"
    )
  );
});