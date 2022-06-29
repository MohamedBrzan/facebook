const { SupporterAuthentication } = require('../../middleWares/Authentication');
const express = require('express');
const path = require('path');

const router = express.Router();
const multer = require('multer');
const ErrorHandler = require('../../middleWares/ErrorHandler');
const {
  GetSupporterProfile,
  UpdateSupporterProfile,
  GetAllSupporters,
  GetSupporterById,
  SentMessageToUser,
  GetAllMessages,
} = require('../../controllers/SupporterControllers/SupporterControllers');

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

// Get Supporter By Id
router.route('/:id').get(SupporterAuthentication, GetSupporterById);

// Get Supporter Profile && Update Supporter Profile
router
  .route('/me')
  .get(SupporterAuthentication, GetSupporterProfile)
  .put(SupporterAuthentication, upload, UpdateSupporterProfile);

// Get Supporter Profile && Update Supporter Profile
router
  .route('/me/messages')
  .get(SupporterAuthentication, GetAllMessages)
  .post(SupporterAuthentication, SentMessageToUser);

// Get All Supporters
router.route('/').get(GetAllSupporters);

module.exports = router;
