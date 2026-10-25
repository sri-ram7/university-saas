const { body } = require("express-validator");

exports.createBatchValidator = [
  body("name").notEmpty(),

  body("startYear").isInt(),

  body("endYear").isInt(),

  body("program").notEmpty(),
];