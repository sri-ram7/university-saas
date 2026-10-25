const AuditLog = require("../models/AuditLog");
const APIFeatures = require("../utils/APIFeatures");

exports.getAuditLogs = async (query = {}) => {
  const features = new APIFeatures(
    AuditLog.find()
      .populate("user", "name email role")
      .sort("-createdAt"),
    query
  ).paginateIfRequested();

  return await features.query.lean();
};