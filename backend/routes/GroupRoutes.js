const { userAuthentication } = require('../middleWares/Authentication');
const ErrorHandler = require('../middleWares/ErrorHandler');
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const {
  GetAllGroups,
  CreateGroup,
  UpdateGroup,
  GetGroupById,
  DeleteGroup,
  FollowOrUnFollowGroup,
  JoinOrUnJoinGroup,
  AddOrRemoveGroupAdmin,
} = require('../controllers/GroupControllers');
const IsGroupOwnerOrAdmin = require('../middleWares/IsGroupOwnerOrAdmin');

// Handle Images upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/groups');
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

router
  .route('/')
  .get(GetAllGroups)
  .post(userAuthentication, upload, CreateGroup);

router
  .route('/:id')
  .get(GetGroupById)
  .post(userAuthentication, IsGroupOwnerOrAdmin, FollowOrUnFollowGroup)
  .put(userAuthentication, upload, UpdateGroup)
  .delete(userAuthentication, DeleteGroup);

router
  .route('/:id/admin')
  .post(userAuthentication, IsGroupOwnerOrAdmin, AddOrRemoveGroupAdmin);

router.route('/:id/join').post(userAuthentication, JoinOrUnJoinGroup);

module.exports = router;
