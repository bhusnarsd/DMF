const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

const createNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.createNotification(req.body);
  res.status(httpStatus.CREATED).send(notification);
});

const getNotifications = catchAsync(async (req, res) => {
  const notifications = await notificationService.getNotificationsByUserId(req.query.userId);
  res.send(notifications);
});

const markNotificationAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.userId);
  res.send(notification);
});
const chatHistory = catchAsync(async (req, res) => {
  const { sender, recipient } = req.query;
  const chat = await notificationService.getChatistory(sender, recipient);
  res.send(chat);
});

const deleteNotificationById = catchAsync(async (req, res) => {
  const notification = await notificationService.deleteNotificationById(req.params.id);
  res.send(notification);
});
module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  chatHistory,
  deleteNotificationById,
};
