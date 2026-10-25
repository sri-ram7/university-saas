const ApiError = require("../utils/ApiError.js");

module.exports = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Forbidden");
        }

        next();
    };
};
