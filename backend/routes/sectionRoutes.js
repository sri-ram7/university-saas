const express = require("express");
const router = express.Router();

const {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");

const {
  createSectionValidator,
} = require("../validators/sectionValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createSectionValidator,
  validate,
  createSection
);

router.get(
  "/",
  authMiddleware,
  getSections
);

router.get(
  "/:id",
  authMiddleware,
  getSectionById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateSection
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteSection
);

module.exports = router;