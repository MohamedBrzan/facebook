const { userAuthentication } = require('../middleWares/Authentication');
const ErrorHandler = require('../middleWares/ErrorHandler');
const express = require('express');
const {
  GetAllPosts,
  CreatePost,
  UpdatePost,
  DeletePost,
  LikeAndDisLikePost,
  CreateComment,
  DeleteComment,
  UpdateComment,
  GetPostById,
  UpdatePostPhoto,
  DeletePostPhoto,
} = require('../controllers/PostControllers');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/images/posts'),
  filename: (req, file, cb) =>
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    ),
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/png'
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

// Get All Posts && Create Post

router
  .route('/')
  .get(GetAllPosts)
  .post(userAuthentication, upload.array('posts', 100), CreatePost);

// Get Post By Id && Like || DisLike Post && Update Post && Delete Post

router
  .route('/:id')
  .get(GetPostById)
  .post(userAuthentication, LikeAndDisLikePost)
  .put(userAuthentication, upload.array('new-posts', 100), UpdatePost)
  .delete(userAuthentication, DeletePost);

//Update Post Photo && Delete Post Photo

router
  .route('/:id/photo')
  .put(userAuthentication, upload.single('new-posts'), UpdatePostPhoto)
  .delete(userAuthentication, DeletePostPhoto);

// Create Comment && Update Comment && Delete Comment

router
  .route('/:id/comment')
  .post(userAuthentication, CreateComment)
  .put(userAuthentication, UpdateComment)
  .delete(userAuthentication, DeleteComment);

module.exports = router;
