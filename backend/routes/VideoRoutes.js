const { userAuthentication } = require('../middleWares/Authentication');
const ErrorHandler = require('../middleWares/ErrorHandler');
const express = require('express');
const {
  GetAllVideos,
  CreateVideo,
  UpdateVideo,
  DeleteVideo,
  LikeAndDisLikeVideo,
  CreateComment,
  DeleteComment,
  UpdateComment,
  GetVideoById,
} = require('../controllers/VideoControllers');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/images/videos'),
  filename: (req, file, cb) =>
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    ),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes('video')) {
    cb(null, true);
  } else {
    console.log(file);
    cb(
      new ErrorHandler(
        'Invalid File Type  --- supported File Types are video/mp4, video/mov, video/wmv, video/flv, video/avi, video/mkv, video/webm',
        400
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1080 * 1920 * 5,
  },
});

// Get All Videos && Create Video

router
  .route('/')
  .get(GetAllVideos)
  .post(
    userAuthentication,
    upload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
    CreateVideo
  );

// Get Video By Id && Like || DisLike Video && Update Video && Delete Video

router
  .route('/:id')
  .get(GetVideoById)
  .post(userAuthentication, LikeAndDisLikeVideo)
  .put(
    userAuthentication,
    upload.fields([
      { name: 'new-video', maxCount: 1 },
      { name: 'new-cover', maxCount: 1 },
    ]),
    UpdateVideo
  )
  .delete(userAuthentication, DeleteVideo);

// Create Comment && Update Comment && Delete Comment

router
  .route('/:id/comment')
  .post(userAuthentication, CreateComment)
  .put(userAuthentication, UpdateComment)
  .delete(userAuthentication, DeleteComment);

module.exports = router;
