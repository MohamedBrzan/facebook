const { userAuthentication } = require('../../middleWares/Authentication');
const express = require('express');
const path = require('path');
const {
  GetAllUsers,
  GetUserById,
  GetUserProfile,
  UpdateUserProfile,
  FollowOrUnFollowUser,
  DeleteAllUserNotifications,
  SendMessageToUser,
  BlockingUser,
  GetAllBlockedUsers,
  DeleteBlockingUser,
  TogglePrivateStatus,
  ToggleOnlineStatus,
  ToggleVerifiedStatus,
  ToggleDeletedStatus,
} = require('../../controllers/UserControllers/UserControllers');
const router = express.Router();
const multer = require('multer');
const ErrorHandler = require('../../middleWares/ErrorHandler');

// Handle Images upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/users');
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
}).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);

// Get User Profile && Update User Profile && Send Message To User
router
  .route('/me')
  .get(userAuthentication, GetUserProfile)
  .post(userAuthentication, SendMessageToUser)
  .put(userAuthentication, upload, UpdateUserProfile);

// Get User By Id
router
  .route('/:id')
  .get(userAuthentication, GetUserById)
  .post(userAuthentication, FollowOrUnFollowUser)
  .delete(userAuthentication, DeleteAllUserNotifications);

// Blocking User
router
  .route('/:id/blocks')
  .get(userAuthentication, GetAllBlockedUsers)
  .post(userAuthentication, BlockingUser)
  .delete(userAuthentication, DeleteBlockingUser);

// Toggle Private Status
router.route('/:id/private').post(userAuthentication, TogglePrivateStatus);

// Toggle Online Status
router.route('/:id/online').post(userAuthentication, ToggleOnlineStatus);

// Toggle Verified Status
router.route('/:id/verified').post(userAuthentication, ToggleVerifiedStatus);

// Toggle Deleted Status
router.route('/:id/deleted').post(userAuthentication, ToggleDeletedStatus);

// Get All Users
router.route('/').get(GetAllUsers);

module.exports = router;
