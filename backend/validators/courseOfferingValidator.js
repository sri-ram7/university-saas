const { body } = require("express-validator");

exports.createCourseOfferingValidator = [
  body("course").notEmpty(),

  body("faculty").notEmpty(),

  body("semester").notEmpty(),

  body("section").notEmpty(),

  body("batch").notEmpty(),
];