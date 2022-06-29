const express = require('express');
const {
  Register,
  Login,
  LoggedIn,
  Logout,
} = require('../../controllers/SupporterControllers/SupportersAuthControllers');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// Handle Images upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/supporters');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/gif'
  ) {
    cb(null, true);
  } else {
    cb(
      new ErrorHandler(
        'Invalid File Type  --- supported File Types are image/jpeg, image/png, image/jpg, image/gif',
        400
      )
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single('avatar');

// Register User
router.route('/register').post(upload, Register);

// Login User
router.route('/login').get(Login);

// LoggedIn User
router.route('/loggedIn').get(LoggedIn);

// Logout User
router.route('/logout').get(Logout);

module.exports = router;
