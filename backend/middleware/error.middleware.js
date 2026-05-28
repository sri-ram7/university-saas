class ApiError extends Error {
  constructor(
    message,
    statusCode = 500,
    details = null
  ) {
    super(message);

    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(
      this,
      this.constructor
    );
  }
}

const validate =
  (
    schema,
    source = "body"
  ) =>
  (req, res, next) => {
    const {
      error,
      value,
    } = schema.validate(
      req[source],
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

    if (error) {
      const details = {};

      error.details.forEach(
        (d) => {
          const key =
            d.path.join(".");

          details[key] =
            d.message;
        }
      );

      return next(
        new ApiError(
          "Validation failed",
          400,
          details
        )
      );
    }

    req[source] = value;

    next();
  };

const globalErrorHandler = (
  err,
  req,
  res,
  next
) => {
  if (err.code === 11000) {
    const field =
      Object.keys(
        err.keyValue || {}
      )[0] || "field";

    return res.status(409).json({
      success: false,

      message: `A record with this ${field} already exists`,

      details: {
        [field]: `Duplicate ${field}`,
      },
    });
  }

  if (
    err.name ===
    "ValidationError"
  ) {
    const details = {};

    Object.entries(
      err.errors
    ).forEach(([k, v]) => {
      details[k] = v.message;
    });

    return res.status(400).json({
      success: false,
      message:
        "Validation failed",
      details,
    });
  }

  if (
    err.name === "CastError"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid resource ID format",
    });
  }

  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .json({
        success: false,
        message: err.message,

        ...(err.details && {
          details: err.details,
        }),
      });
  }

  console.error(
    "[UnhandledError]",
    err
  );

  return res.status(500).json({
    success: false,

    message:
      "An unexpected error occurred. Please try again later.",
  });
};

const notFoundHandler = (
  req,
  res
) => {
  res.status(404).json({
    success: false,

    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = {
  ApiError,
  validate,
  globalErrorHandler,
  notFoundHandler,
};