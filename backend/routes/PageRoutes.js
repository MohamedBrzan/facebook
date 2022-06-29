const { userAuthentication } = require('../middleWares/Authentication');
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const IsPageOwnerOrAdmin = require('../middleWares/IsPageOwnerOrAdmin');
const {
  JoinOrUnJoinPage,
  AddOrRemovePageAdmin,
  GetAllPages,
  UpdatePage,
  CreatePage,
  GetPageById,
  DeletePage,
} = require('../controllers/PageControllers');
const ErrorHandler = require('../middleWares/ErrorHandler');

// Handle Images upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/pages');
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

router.route('/').get(GetAllPages).post(userAuthentication, upload, CreatePage);

router
  .route('/:id')
  .get(GetPageById)
  .post(userAuthentication, IsPageOwnerOrAdmin, JoinOrUnJoinPage)
  .put(userAuthentication, upload, UpdatePage)
  .delete(userAuthentication, DeletePage);

router
  .route('/:id/admin')
  .post(userAuthentication, IsPageOwnerOrAdmin, AddOrRemovePageAdmin);

module.exports = router;
