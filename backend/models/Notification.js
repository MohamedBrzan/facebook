const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    postNotice: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },

    pageNotice: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },

    groupNotice: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },

    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be at least 3 characters long'],
    },
    description: {
      username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      event: {
        type: String,
        required: [true, 'Event is required'],
        minlength: [3, 'Event must be at least 3 characters long'],
      },
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
