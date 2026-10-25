const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const notificationService = require("../services/notificationService");

exports.createNotification = asyncHandler(async (req, res) => {
  const notification =
    await notificationService.createNotification(
      req.body,
      req.user._id
    );

  res.status(201).json(
    new ApiResponse(
      201,
      notification,
      "Notification created successfully"
    )
  );
});

exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications =
    await notificationService.getNotifications(req.query);

  res.status(200).json(
    new ApiResponse(
      200,
      notifications,
      "Notifications fetched successfully"
    )
  );
});

exports.getNotificationById = asyncHandler(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,
      notification,
      "Notification fetched successfully"
    )
  );
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Notification deleted successfully"
    )
  );
});