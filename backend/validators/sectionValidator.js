const { body } = require("express-validator");

exports.createSectionValidator = [
  body("name").notEmpty(),

  body("department").notEmpty(),

  body("semester").notEmpty(),

  body("faculty").notEmpty(),
];