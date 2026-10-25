const express = require("express");

const router = express.Router();

const {
  createMark,
  getMarks,
  getMarkById,
  updateMark,
  deleteMark,
} = require("../controllers/markController");

const {
  createMarkValidator,
} = require("../validators/markValidator");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");

router.post(
  "/",
  auth,
  role("faculty", "admin"),
  createMarkValidator,
  validate,
  createMark
);

router.get(
  "/",
  auth,
  getMarks
);

router.get(
  "/:id",
  auth,
  getMarkById
);

router.put(
  "/:id",
  auth,
  role("faculty", "admin"),
  updateMark
);

router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteMark
);

module.exports = router;