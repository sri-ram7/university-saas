const express = require("express");
const router = express.Router();

const {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} = require("../controllers/enrollmentController");

const {
  createEnrollmentValidator,
} = require("../validators/enrollmentValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "faculty", "student"),
  createEnrollmentValidator,
  validate,
  createEnrollment
);

router.get(
  "/",
  authMiddleware,
  getEnrollments
);

router.get(
  "/:id",
  authMiddleware,
  getEnrollmentById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateEnrollment
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteEnrollment
);

module.exports = router;