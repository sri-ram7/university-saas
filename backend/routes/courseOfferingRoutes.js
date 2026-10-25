const express = require("express");
const router = express.Router();

const {
  createCourseOffering,
  getCourseOfferings,
  getCourseOfferingById,
  updateCourseOffering,
  deleteCourseOffering,
} = require("../controllers/courseOfferingController");

const {
  createCourseOfferingValidator,
} = require("../validators/courseOfferingValidator");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");

router.post(
  "/",
  auth,
  role("admin"),
  createCourseOfferingValidator,
  validate,
  createCourseOffering
);

router.get(
  "/",
  auth,
  getCourseOfferings
);

router.get(
  "/:id",
  auth,
  getCourseOfferingById
);

router.put(
  "/:id",
  auth,
  role("admin"),
  updateCourseOffering
);

router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteCourseOffering
);

module.exports = router;