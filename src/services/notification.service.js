const httpStatus = require('http-status');
const { Notification } = require('../models');
const ApiError = require('../utils/ApiError');
const Message = require('../models/message.model');

const createNotification = async (notificationData) => {
  return Notification.create(notificationData);
};

const getNotificationsByUserId = async (userId) => {
  return Notification.find({ userId }).sort({ createdAt: -1 });
};

const getNotificationsById = async (id) => {
  return Notification.findById(id);
};

const markAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { userId }, // Find notifications by userId
    { $set: { read: true } }, // Set the read field to true
    { new: true } // Return the updated documents
  );
  return result;
};

const getChatistory = async (sender, recipient) => {
  const chatHistory = await Message.find({ sender, recipient });
  return chatHistory;
};

/**
 * Delete user by id
 * @param {ObjectId} schoolId
 * @returns {Promise<School>}
 */
const deleteNotificationById = async (id) => {
  const notification = await getNotificationsById(id);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  await notification.remove();
  return notification;
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markAsRead,
  deleteNotificationById,
  getChatistory,
};
