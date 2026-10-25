const { body } = require("express-validator");

exports.createSemesterValidator = [
  body("name").notEmpty(),
  body("number").isInt({ min: 1, max: 8 }),
  body("academicYear").notEmpty(),
  body("startDate").isISO8601(),
  body("endDate").isISO8601(),
];