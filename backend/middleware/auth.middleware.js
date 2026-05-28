const jwt = require("jsonwebtoken");

const {
  ApiError,
} = require("./error.middleware");

const authenticate = (
  req,
  res,
  next
) => {
  const authHeader =
    req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith(
      "Bearer "
    )
  ) {
    return next(
      new ApiError(
        "Authentication token is missing or malformed",
        401
      )
    );
  }

  const token =
    authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (err) {
    if (
      err.name ===
      "TokenExpiredError"
    ) {
      return next(
        new ApiError(
          "Authentication token has expired. Please log in again.",
          401
        )
      );
    }

    return next(
      new ApiError(
        "Invalid authentication token",
        401
      )
    );
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (
      !req.user ||
      !roles.includes(
        req.user.role
      )
    ) {
      return next(
        new ApiError(
          "You do not have permission to perform this action",
          403
        )
      );
    }

    next();
  };

module.exports = {
  authenticate,
  authorize,
};