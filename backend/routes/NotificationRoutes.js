const { userAuthentication } = require('../middleWares/Authentication');
const express = require('express');
const router = express.Router();

const {
  GetAllNotifications,
  GetNotificationById,
} = require('../controllers/NotificationControllers');

// Get All Notifications

router.route('/').get(userAuthentication, GetAllNotifications);

// Get Notification By Id

router.route('/:id').get(userAuthentication, GetNotificationById);

module.exports = router;
