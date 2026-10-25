const { body } = require("express-validator");

exports.createExamValidator = [
  body("name").notEmpty(),

  body("type").isIn([
    "INTERNAL",
    "MID",
    "PRACTICAL",
    "EXTERNAL",
  ]),

  body("courseOffering").notEmpty(),

  body("examDate").isISO8601(),

  body("totalMarks").isNumeric(),

  body("passingMarks").isNumeric(),
];