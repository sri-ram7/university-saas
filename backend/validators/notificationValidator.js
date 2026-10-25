const { body } = require("express-validator");

exports.createNotificationValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("message")
    .notEmpty()
    .withMessage("Message is required"),

  body("audience")
    .isIn(["ALL", "STUDENT", "FACULTY"])
    .withMessage("Invalid audience"),
];