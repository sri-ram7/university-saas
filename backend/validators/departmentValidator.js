const { body } = require("express-validator");

exports.createDepartmentValidator = [
  body("name")
    .notEmpty()
    .withMessage("Department name is required"),

  body("code")
    .notEmpty()
    .withMessage("Department code is required"),
];

exports.updateDepartmentValidator = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Department name cannot be empty"),

  body("code")
    .optional()
    .notEmpty()
    .withMessage("Department code cannot be empty"),
];