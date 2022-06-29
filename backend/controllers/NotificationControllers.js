const Notification = require('../models/Notification');
const User = require('../models/User');
const Group = require('../models/Group');
const Page = require('../models/Page');
const AsyncHandler = require('../utils/AsyncHandler');
const ErrorHandler = require('../middleWares/ErrorHandler');
const { unlink } = require('node:fs/promises');

// Get All Notifications
exports.GetAllNotifications = AsyncHandler(async (req, res, next) => {
  const notifications = await Notification.find();

  res.status(200).json(notifications);
});

// Get Notification By Id
exports.GetNotificationById = AsyncHandler(async (req, res, next) => {
  const notifications = await Notification.findById(req.params.id);

  if (!notifications)
    return next(new ErrorHandler('Notification Not Found Or Deleted', 404));

  res.status(200).json(notifications);
});
