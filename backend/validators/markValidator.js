const { body } = require("express-validator");

exports.createMarkValidator = [
  body("student")
    .notEmpty()
    .withMessage("Student is required"),

  body("exam")
    .notEmpty()
    .withMessage("Exam is required"),

  body("obtainedMarks")
    .isNumeric()
    .withMessage("Obtained marks must be a number"),
];