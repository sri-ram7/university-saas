const AuditLog = require("../models/AuditLog");
const { getSafeRoute } = require("../utils/requestMetadata");

module.exports = (moduleName) => {
  return async (req, res, next) => {
    await AuditLog.create({
      user: req.user._id,
      action: `${req.method} ${moduleName}`,
      module: moduleName,
      method: req.method,
      endpoint: getSafeRoute(req),
      ipAddress: req.ip,
    });

    next();
  };
};