const { body } = require("express-validator");

const studentValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("department")
    .notEmpty()
    .withMessage("Department is required"),

  body("advisor")
    .optional(),

  body("courses")
    .optional()
    .isArray()
    .withMessage("Courses must be an array"),
];

module.exports = studentValidationRules;