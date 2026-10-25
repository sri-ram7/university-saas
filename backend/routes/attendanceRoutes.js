const express = require("express");
const router = express.Router();

const {
  createAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const {
  createAttendanceValidator,
} = require("../validators/attendanceValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("faculty", "admin"),
  createAttendanceValidator,
  validate,
  createAttendance
);

router.get(
  "/",
  authMiddleware,
  getAttendance
);

router.get(
  "/:id",
  authMiddleware,
  getAttendanceById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("faculty", "admin"),
  updateAttendance
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteAttendance
);

module.exports = router;