const express = require("express");
const router = express.Router();

const {
  createSemester,
  getSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester,
} = require("../controllers/semesterController");

const {
  createSemesterValidator,
} = require("../validators/semesterValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createSemesterValidator,
  validate,
  createSemester
);

router.get(
  "/",
  authMiddleware,
  getSemesters
);

router.get(
  "/:id",
  authMiddleware,
  getSemesterById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateSemester
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteSemester
);

module.exports = router;