const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: [true, 'Name Is Required'] },
    avatar: {
      fieldname: {
        type: String,
        trim: true,
        required: [true, 'fieldname Is Required'],
      },
      originalname: {
        type: String,
        trim: true,
        required: [true, 'originalname Is Required'],
      },
      encoding: {
        type: String,
        trim: true,
        required: [true, 'encoding Is Required'],
      },
      mimetype: {
        type: String,
        trim: true,
        required: [true, 'mimetype Is Required'],
      },
      destination: {
        type: String,
        trim: true,
        required: [true, 'destination Is Required'],
      },
      filename: {
        type: String,
        trim: true,
        required: [true, 'filename Is Required'],
      },
      path: { type: String, trim: true, required: [true, 'path Is Required'] },
      size: { type: Number, required: [true, 'size Is Required'] },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
    cover: {
      fieldname: { type: String, required: [true, 'fieldname Is Required'] },
      fieldname: {
        type: String,
        trim: true,
        required: [true, 'fieldname Is Required'],
      },
      originalname: {
        type: String,
        trim: true,
        required: [true, 'originalname Is Required'],
      },
      encoding: {
        type: String,
        trim: true,
        required: [true, 'encoding Is Required'],
      },
      mimetype: {
        type: String,
        trim: true,
        required: [true, 'mimetype Is Required'],
      },
      destination: {
        type: String,
        trim: true,
        required: [true, 'destination Is Required'],
      },
      filename: {
        type: String,
        trim: true,
        required: [true, 'filename Is Required'],
      },
      path: { type: String, trim: true, required: [true, 'path Is Required'] },
      size: { type: Number, required: [true, 'size Is Required'] },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'video' }],
    about: {
      membersNumber: {
        type: Number,
        default: 0,
      },
      followersNumber: {
        type: Number,
        default: 0,
      },
      bio: { type: String, required: [true, 'Bio Is Required'] },
    },
    albums: [
      {
        title: {
          type: String,
          required: [true, 'Title is required'],
          minlength: [3, 'Title must be at least 3 characters long'],
          maxLength: 255,
        },

        description: {
          type: String,
          minlength: [3, 'Description must be at least 3 characters long'],
          maxLength: 255,
        },

        photos: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Group', GroupSchema);
