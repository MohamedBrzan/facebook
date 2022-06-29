const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please Add An Author'],
    },

    title: {
      type: String,
      required: [true, 'Please Add A Title'],
      maxLength: 100,
      trim: true,
    },

    content: {
      type: String,
      required: [true, 'Please Add A Content'],
      maxLength: 1000,
      trim: true,
    },

    video: {
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

    cover: {
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

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    comments: [
      {
        text: {
          type: String,
          required: [true, 'Please Add A Comment'],
          maxLength: 300,
          trim: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: [true, 'Please Add An Author'],
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', VideoSchema);
