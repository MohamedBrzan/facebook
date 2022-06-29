const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [3, 'Name must be at least 3 characters long'],
      maxLength: 255,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      minlength: [12, 'Email must be at least 12 characters long'],
      maxLength: 255,
      validate: validator.isEmail,
      unique: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      maxLength: 255,
    },

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

    bio: {
      type: String,
      minlength: [3, 'Bio must be at least 3 characters long'],
      maxLength: 255,
    },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],

    pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],

    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'video' }],

    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],

    notifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' },
    ],

    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },

        consignee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },

        message: {
          type: String,
          required: [true, 'Message is required'],
        },
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },


    blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    supporters: [
      {
        supporter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Supporter',
        },

        message: {
          type: String,
          required: [true, 'Message is required'],
          minlength: [3, 'Message must be at least 3 characters long'],
        },
      },
    ],
  },
  { timestamps: true }
);

// Hash the password before saving
UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hash(this.password, 10);
  }

  next();
});

// Generate JWT token for users
UserSchema.methods.generateUserToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      isVerified: this.isVerified,
      isBanned: this.isBanned,
      isDeleted: this.isDeleted,
      isPrivate: this.isPrivate,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '30d' }
  );
};

// Compare the password of the user with the password of the databaseUrl
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Export the models
module.exports = mongoose.model('User', UserSchema);
