const { body } = require("express-validator");

exports.registerValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

exports.loginValidator = [
    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

exports.forgotPasswordValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),
];

exports.resetPasswordValidator = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

exports.resendVerificationValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),
];

exports.sendOtpValidator = [
  body("target").notEmpty().withMessage("Target identifier is required"),
  body("purpose").notEmpty().withMessage("Purpose is required"),
];

exports.verifyOtpValidator = [
  body("target").notEmpty().withMessage("Target identifier is required"),
  body("purpose").notEmpty().withMessage("Purpose is required"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("6-digit OTP code is required"),
];