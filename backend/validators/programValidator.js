const { body } = require("express-validator");

exports.createProgramValidator = [
  body("name").notEmpty(),

  body("code").notEmpty(),

  body("duration").isInt({ min: 1 }),

  body("department").notEmpty(),
];