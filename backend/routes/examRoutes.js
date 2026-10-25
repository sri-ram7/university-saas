const express = require("express");

const router = express.Router();

const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

const {
  createExamValidator,
} = require("../validators/examValidator");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");

router.post(
  "/",
  auth,
  role("admin", "faculty"),
  createExamValidator,
  validate,
  createExam
);

router.get(
  "/",
  auth,
  getExams
);

router.get(
  "/:id",
  auth,
  getExamById
);

router.put(
  "/:id",
  auth,
  role("admin", "faculty"),
  updateExam
);

router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteExam
);

module.exports = router;