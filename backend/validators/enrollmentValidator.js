const { body } = require("express-validator");

exports.createEnrollmentValidator = [
  body("student")
    .notEmpty()
    .withMessage("Student is required"),

  body("courseOffering")
    .notEmpty()
    .withMessage("Course offering is required"),

  body("semester")
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8"),

  body("academicYear")
    .notEmpty()
    .withMessage("Academic year is required"),
];