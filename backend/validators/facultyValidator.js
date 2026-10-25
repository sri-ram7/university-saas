const { body } = require("express-validator");

exports.createFacultyValidator = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email").isEmail().withMessage("Valid email is required"),

  body("phone").notEmpty().withMessage("Phone is required"),

  body("designation")
    .notEmpty()
    .withMessage("Designation is required"),

  body("department")
    .notEmpty()
    .withMessage("Department is required"),
];

exports.updateFacultyValidator = [
  body("name").optional().notEmpty(),

  body("email").optional().isEmail(),

  body("phone").optional().notEmpty(),

  body("designation").optional().notEmpty(),

  body("department").optional().notEmpty(),
];