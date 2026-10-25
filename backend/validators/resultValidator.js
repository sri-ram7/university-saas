const { body } = require("express-validator");

exports.generateResultValidator = [
  body("student")
    .notEmpty()
    .withMessage("Student is required"),

  body("semester")
    .notEmpty()
    .withMessage("Semester is required"),
];