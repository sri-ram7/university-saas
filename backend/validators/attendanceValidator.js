const { body } = require("express-validator");

exports.createAttendanceValidator = [
  body("student").notEmpty(),
  body("course").notEmpty(),
  body("faculty").notEmpty(),
  body("semester").notEmpty(),
  body("date").isISO8601(),
  body("status").isIn([
    "PRESENT",
    "ABSENT",
    "LATE",
  ]),
];