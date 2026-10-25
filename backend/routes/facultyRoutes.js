const express = require("express");
const router = express.Router();

const {
  createFaculty,
  getFaculties,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyController");

const {
  createFacultyValidator,
  updateFacultyValidator,
} = require("../validators/facultyValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("student", "faculty", "admin"),
  createFacultyValidator,
  validate,
  createFaculty
);

router.get("/", authMiddleware, getFaculties);

router.get("/:id", authMiddleware, getFacultyById);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateFacultyValidator,
  validate,
  updateFaculty
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteFaculty
);

module.exports = router;