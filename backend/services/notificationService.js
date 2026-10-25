const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createNotification = async (data, userId) => {
  return await Notification.create({
    ...data,
    createdBy: userId,
  });
};

exports.getNotifications = async (query = {}) => {
  const features = new APIFeatures(
    Notification.find({ isDeleted: { $ne: true } })
      .populate("createdBy", "name email role")
      .sort("-createdAt"),
    query
  ).paginateIfRequested();

  return await features.query.lean();
};

exports.getNotificationById = async (id) => {
  const notification = await Notification.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("createdBy", "name email role")
    .lean();

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};

exports.deleteNotification = async (id) => {
  const notification = await softDelete(Notification, id);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};