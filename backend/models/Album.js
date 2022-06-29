const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

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

    photos: [
      {
        fieldname: {
          type: String,
          required: [true, 'Please Add An Image fieldname'],
          trim: true,
        },
        originalname: {
          type: String,
          required: [true, 'Please Add An Image Originalname'],
          trim: true,
        },
        encoding: {
          type: String,
          required: [true, 'Please Add An Image Encoding'],
          trim: true,
        },
        mimetype: {
          type: String,
          required: [true, 'Please Add An Image Mimetype'],
          trim: true,
        },
        destination: {
          type: String,
          required: [true, 'Please Add An Image Destination'],
          trim: true,
        },
        filename: {
          type: String,
          required: [true, 'Please Add An Image Filename'],
          trim: true,
        },
        path: {
          type: String,
          required: [true, 'Please Add An Image Path'],
          trim: true,
        },
        size: {
          type: Number,
          required: [true, 'Please Add An Image Size'],
        },
        date: { type: Date, default: Date.now },
      },
    ],

    isVerified: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Export the models
module.exports = mongoose.model('Album', AlbumSchema);
