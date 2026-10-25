const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const {
  createCourseValidator,
  updateCourseValidator,
} = require("../validators/courseValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "faculty", "student"),
  createCourseValidator,
  validate,
  createCourse
);

router.get("/", authMiddleware, getCourses);

router.get("/:id", authMiddleware, getCourseById);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("student", "faculty", "admin"),
  updateCourseValidator,
  validate,
  updateCourse
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteCourse
);

module.exports = router;