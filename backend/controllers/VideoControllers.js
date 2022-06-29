const Video = require('../models/Video');
const User = require('../models/User');
const Group = require('../models/Group');
const Page = require('../models/Page');
const AsyncHandler = require('../utils/AsyncHandler');
const ErrorHandler = require('../middleWares/ErrorHandler');
const { unlink } = require('node:fs/promises');

// Get All Videos
exports.GetAllVideos = AsyncHandler(async (req, res, next) => {
  const videos = await Video.find();

  res.status(200).json(videos);
});

// Get Video By Id
exports.GetVideoById = AsyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) return next(new ErrorHandler('Video Not Found Or Deleted', 404));

  res.status(200).json(video);
});

// Create Video
exports.CreateVideo = AsyncHandler(async (req, res, next) => {
  const { title, content, groupId, pageId } = req.body;

  const video = req.files.video[0];

  const cover = req.files.cover[0];

  const newVideo = await Video.create({
    title,
    content,
    video,
    cover,
    owner: req.user._id,
  });

  if (groupId) {
    const group = await Group.findById(groupId);

    if (!group) return next(new ErrorHandler('Group Not Found', 404));

    group.videos.push(newVideo);

    await group.save();

    return res.status(201).json(newVideo);
  } else if (pageId) {
    const page = await Page.findById(groupId);

    if (!page) return next(new ErrorHandler('Page Not Found', 404));

    page.videos.push(newVideo);

    await page.save();

    return res.status(201).json(newVideo);
  } else {
    const user = await User.findById(req.user._id);

    if (!user) return next(new ErrorHandler('User Not Found', 404));

    user.videos.push(newVideo);

    await user.save();

    return res.status(201).json(newVideo);
  }
});

// Update Video
exports.UpdateVideo = AsyncHandler(async (req, res, next) => {
  const { title, content } = req.body;

  const cover = req.file;

  let video = await Video.findById(req.params.id);

  if (!video) return next(new ErrorHandler('Video Not Found', 404));

  await Video.findByIdAndUpdate(
    req.params.id,
    { title, content, cover },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(video);
});

// Delete Video
exports.DeleteVideo = AsyncHandler(async (req, res, next) => {
  const { groupId, pageId } = req.body;

  let video = await Video.findById(req.params.id);

  if (!video) return next(new ErrorHandler('Video Not Found Or Deleted', 404));

  await unlink(`uploads/images/videos/${video.cover.filename}`);

  video = await Video.findByIdAndDelete(req.params.id);

  if (groupId) {
    const group = await Group.findById(groupId);

    if (!group) return next(new ErrorHandler('Group Not Found', 404));

    group.videos.pull(video._id);

    await group.save();

    return res.status(200).json({
      status: 200,
      message: 'Video Deleted Successfully & From Group',
    });
  } else if (pageId) {
    const page = await Page.findById(pageId);

    if (!page) return next(new ErrorHandler('Page Not Found', 404));

    page.videos.pull(video._id);

    await page.save();

    return res.status(200).json({
      status: 200,
      message: 'Video Deleted Successfully & From Page',
    });
  } else {
    const user = await User.findById(req.user._id);

    if (!user) return next(new ErrorHandler('User Not Found', 404));

    user.videos.pull(video._id);

    await user.save();

    return res
      .status(200)
      .json({ status: 200, message: 'Video Deleted Successfully & From User' });
  }
});

// Like Video
exports.LikeAndDisLikeVideo = AsyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) return next(new ErrorHandler('Video Not Found', 404));

  if (video.likes.includes(req.user._id)) {
    video.likes.pull(req.user._id);
  } else {
    video.likes.push(req.user._id);
  }

  await video.save();

  res.status(200).json(video);
});

// Comment Video
exports.CreateComment = AsyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) return next(new ErrorHandler('Video Not Found', 404));

  const comment = {
    text: req.body.text,
    user: req.user._id,
  };

  video.comments.push(comment);

  await video.save();

  res.status(200).json(video);
});

// Update Comment
exports.UpdateComment = AsyncHandler(async (req, res, next) => {
  const { commentId, text } = req.body;

  const video = await Video.findById(req.params.id);

  if (!video) return next(new ErrorHandler('Video Not Found', 404));

  const comment = video.comments.id(commentId);

  if (!comment) return next(new ErrorHandler('Comment Not Found', 404));

  comment.text = text;

  await video.save();

  res.status(200).json(video);
});

// Delete Comment
exports.DeleteComment = AsyncHandler(async (req, res, next) => {
  const { commentId } = req.body;

  const video = await Video.findById(req.params.id);

  if (!video) return next(new ErrorHandler('Video Not Found Or Deleted', 404));

  const comment = video.comments.find(
    (comment) => comment._id.toString() === commentId
  );

  if (!comment)
    return next(new ErrorHandler('Comment Not Found Or Deleted', 404));

  if (comment.user.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler('Unauthorized, This Operation For Comment Owner', 401)
    );
  }

  video.comments.pull(comment);

  await video.save();

  res.status(200).json(video);
});
