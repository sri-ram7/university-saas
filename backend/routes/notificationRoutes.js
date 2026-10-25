const express = require("express");

const router = express.Router();

const {
  createNotification,
  getNotifications,
  getNotificationById,
  deleteNotification,
} = require("../controllers/notificationController");

const {
  createNotificationValidator,
} = require("../validators/notificationValidator");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");

router.post(
  "/",
  auth,
  role("admin"),
  createNotificationValidator,
  validate,
  createNotification
);

router.get(
  "/",
  auth,
  getNotifications
);

router.get(
  "/:id",
  auth,
  getNotificationById
);

router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteNotification
);

module.exports = router;