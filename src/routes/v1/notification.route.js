const express = require('express');
const auth = require('../../middlewares/auth');
const { notificationController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('admin', 'school', 'superadmin', 'student', 'cluster', 'trainer', 'department', 'skillTrainer'),
    notificationController.createNotification
  )
  .get(
    auth('admin', 'school', 'superadmin', 'student', 'cluster', 'trainer', 'department', 'skillTrainer'),
    notificationController.getNotifications
  );

router.route('/chat-history').get(notificationController.chatHistory);

router.route('/:userId').patch(notificationController.markNotificationAsRead);

router.route('/delete/:id').delete(notificationController.deleteNotificationById);
module.exports = router;
