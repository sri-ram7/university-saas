// authRoutes
const express = require('express');
const router = express.Router();

const {register} = require("../controllers/authController.js");
const {registerValidator} = require("../validators/authValidator");
const validate = require("../middleware/validationMiddleware");
const {login} = require("../controllers/authController.js");
const {loginValidator} = require("../validators/authValidator");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {refreshToken} = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware");
const {logout} = require("../controllers/authController.js");
const {verifyEmail} = require("../controllers/authController.js");
const {forgotPassword} = require("../controllers/authController.js");
const { forgotPasswordValidator } = require("../validators/authValidator");
const { resetPasswordValidator } = require("../validators/authValidator");
const { resetPassword } = require("../controllers/authController.js");
const { authRateLimiter } = require("../middleware/rateLimiter");

router.post("/register", authRateLimiter, registerValidator, validate, register);    
router.post("/login", authRateLimiter, loginValidator, validate, login);
router.post("/refresh", refreshToken);

router.post(
  "/logout",
  authMiddleware,
  logout
);

const { resendVerification } = require("../controllers/authController.js");
const { resendVerificationValidator } = require("../validators/authValidator");

router.get(
  "/verify/:token",
  authRateLimiter,
  verifyEmail
);

router.post(
  "/resend-verification",
  authRateLimiter,
  resendVerificationValidator,
  validate,
  resendVerification
);

router.post(
  "/forgot-password",
  authRateLimiter,
  forgotPasswordValidator,
  validate,
  forgotPassword
);

router.post(
  "/reset-password/:token",
  authRateLimiter,
  resetPasswordValidator,
  validate,
  resetPassword
);

const { sendOtp, verifyOtp } = require("../controllers/authController.js");
const { sendOtpValidator, verifyOtpValidator } = require("../validators/authValidator");

router.post(
  "/send-otp",
  authRateLimiter,
  sendOtpValidator,
  validate,
  sendOtp
);

router.post(
  "/verify-otp",
  authRateLimiter,
  verifyOtpValidator,
  validate,
  verifyOtp
);

module.exports = router;
