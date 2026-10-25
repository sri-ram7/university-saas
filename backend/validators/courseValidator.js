const { body } = require("express-validator");

exports.createCourseValidator = [
  body("name")
    .notEmpty()
    .withMessage("Course name is required"),

  body("code")
    .notEmpty()
    .withMessage("Course code is required"),

  body("credits")
    .isInt({ min: 1, max: 10 })
    .withMessage("Credits must be between 1 and 10"),

  body("semester")
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8"),

  body("department")
    .notEmpty()
    .withMessage("Department is required"),

  body("faculty")
    .notEmpty()
    .withMessage("Faculty is required"),
];

exports.updateCourseValidator = [
  body("name").optional().notEmpty(),

  body("code").optional().notEmpty(),

  body("credits").optional().isInt({ min: 1, max: 10 }),

  body("semester").optional().isInt({ min: 1, max: 8 }),

  body("department").optional().notEmpty(),

  body("faculty").optional().notEmpty(),
];