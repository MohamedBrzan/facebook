const { userAuthentication } = require('../middleWares/Authentication');
const ErrorHandler = require('../middleWares/ErrorHandler');
const express = require('express');

const router = express.Router();
const path = require('path');
const multer = require('multer');
const {
  GetAllAlbums,
  CreateAlbum,
  GetAlbum,
  UpdateAlbum,
  DeleteAllAlbumPhotos,
  UpdatePhoto,
  DeletePhoto,
  DeleteAlbum,
} = require('../controllers/AlbumsControllers');

// Handle Images upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/albums');
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
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// Get Albums && Create Album
router
  .route('/')
  .get(userAuthentication, GetAllAlbums)
  .post(userAuthentication, upload.array('album', 100), CreateAlbum);

// Get Album && Add Update Album && Delete Album
router
  .route('/:id')
  .get(userAuthentication, GetAlbum)
  .put(userAuthentication, upload.array('album', 100), UpdateAlbum)
  .delete(userAuthentication, DeleteAlbum);

// Update Photo (Album) && Delete Photo (Album)
router
  .route('/:id/photo')
  .put(userAuthentication, upload.single('new-album'), UpdatePhoto)
  .delete(userAuthentication, DeletePhoto);

//  Delete All Photos (Album)
router
  .route('/:id/remove/photos')
  .delete(userAuthentication, DeleteAllAlbumPhotos);

module.exports = router;
