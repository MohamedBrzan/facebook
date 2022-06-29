const Post = require('../models/Post');
const User = require('../models/User');
const AsyncHandler = require('../utils/AsyncHandler');
const ErrorHandler = require('../middleWares/ErrorHandler');
const { unlink } = require('node:fs/promises');
const Group = require('../models/Group');
const Notification = require('../models/Notification');
const Page = require('../models/Page');

// Get All Posts
exports.GetAllPosts = AsyncHandler(async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json(posts);
});

// Get Post By Id
exports.GetPostById = AsyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) return next(new ErrorHandler('Post Not Found Or Deleted', 404));

  res.status(200).json(post);
});

//************************ Create New Post And Send Notification ************************//

// Create Post
exports.CreatePost = AsyncHandler(async (req, res, next) => {
  const { title, content, groupId, pageId } = req.body;

  const photos = req.files;

  const post = await Post.create({
    title,
    content,
    photos,
    owner: req.user._id,
  });

  if (groupId) {
    const group = await Group.findById(groupId).populate('owner');

    if (!group) return next(new ErrorHandler('Group Not Found', 404));

    group.posts.push(post);

    await group.save();

    const notification = await Notification.create({
      owner: req.user._id,
      postNotice: post._id,
      groupNotice: group._id,
      title,
      description: {
        username: req.user._id,
        event: `Is Created A New Post In Group ${group.title}, Called ${title}`,
      },
    });

    group.owner.followers.forEach((follower) => {
      follower.notifications.push(notification);
    });

    await group.owner.save();

    group.owner.followings.forEach((following) => {
      following.notifications.push(notification);
    });

    await group.owner.save();

    return res.status(201).json(post);
  } else if (pageId) {
    const page = await Page.findById(pageId).populate('owner');

    if (!page) return next(new ErrorHandler('Page Not Found', 404));

    page.posts.push(post);

    await page.save();

    const notification = await Notification.create({
      owner: req.user._id,
      postNotice: post._id,
      pageNotice: page._id,
      title: post.title,
      description: {
        username: req.user._id,
        event: `Is Created A New Post In Page ${page.title}, Called ${title}`,
      },
    });

    page.owner.followers.forEach((follower) => {
      follower.notifications.push(notification);
    });

    await page.owner.save();

    page.owner.followings.forEach((following) => {
      following.notifications.push(notification);
    });

    await page.owner.save();

    return res.status(201).json(post);
  } else {
    const user = await User.findById(req.user._id)
      .populate('followers')
      .populate('followings');

    if (!user) return next(new ErrorHandler('User Not Found', 404));

    user.posts.push(post);

    await user.save();

    const notification = await Notification.create({
      owner: req.user._id,
      postNotice: post._id,
      title: post.title,
      description: {
        username: req.user._id,
        event: `Is Created A New Post Called ${title}`,
      },
    });

    // for (let i = 0; i < user.followers.length; i++) {
    //   const followers = user.followers[i];

    //   followers.notifications.push(notification);

    //   await user.save();
    // }

    // for (let i = 0; i < user.followings.length; i++) {
    //   const followings = user.followings[i];

    //   followings.notifications.push(notification);

    //   await user.save();
    // }

    // await user.save();

    user.followers.forEach(async (follower) => {
      follower.notifications.push(notification._id);
      await follower.save();
    });

    user.followings.forEach(async (following) => {
      following.notifications.push(notification._id);
      await following.save();
    });

    return res.status(201).json(post);
  }
});

//************************ Update Post And Send Notification ************************//

// Update Post
exports.UpdatePost = AsyncHandler(async (req, res, next) => {
  const { title, content } = req.body;

  const photos = req.files;

  let post = await Post.findById(req.params.id);

  if (!post) return next(new ErrorHandler('Post Not Found', 404));

  if (title && !content) {
    await Notification.create({
      owner: post.owner._id,
      postNotice: post._id,
      title: post.title,
      description: {
        username: req.user._id,
        event: `Is Updated The Post Title From ${post.title} To ${title}`,
      },
    });

    await post.save();
  } else if (content && !title) {
    await Notification.create({
      owner: post.owner._id,
      postNotice: post._id,
      title: post.title,
      description: {
        username: req.user._id,
        event: `Is Updated The Post Content From ${post.content} To ${content}`,
      },
    });

    await post.save();
  } else {
    await Notification.create({
      owner: post.owner._id,
      postNotice: post._id,
      title: post.title,
      description: {
        username: req.user._id,
        event: `Is Updated The Post Title & Content From ${post.title}, ${post.content} To ${title}, ${content}`,
      },
    });

    await post.save();
  }

  post.title = title;
  post.content = content;

  photos.map((photo) =>
    post.photos.push({
      fieldname: photo.fieldname,
      originalname: photo.originalname,
      encoding: photo.encoding,
      mimetype: photo.mimetype,
      destination: photo.destination,
      filename: photo.filename,
      path: photo.path,
      size: photo.size,
    })
  );

  res.status(200).json(post);
});

// Update Post Photo
exports.UpdatePostPhoto = AsyncHandler(async (req, res, next) => {
  const { photoId, filename } = req.body;

  const photo = req.file;

  let post = await Post.findById(req.params.id);

  if (!post) return next(new ErrorHandler('Post Not Found', 404));

  const findPhoto = post.photos.id(photoId);

  if (!findPhoto) return next(new ErrorHandler('Photo Not Found', 404));

  await unlink(`uploads/images/posts/${filename}`);

  (findPhoto.fieldname = photo.fieldname),
    (findPhoto.originalname = photo.originalname),
    (findPhoto.encoding = photo.encoding),
    (findPhoto.mimetype = photo.mimetype),
    (findPhoto.destination = photo.destination),
    (findPhoto.filename = photo.filename),
    (findPhoto.path = photo.path),
    (findPhoto.size = photo.size),
    (findPhoto.date = Date.now()),
    await post.save();

  res.status(200).json(post);
});

// Delete Post photo
exports.DeletePostPhoto = AsyncHandler(async (req, res, next) => {
  const { photoId, filename } = req.body;

  let post = await Post.findById(req.params.id);

  if (!post) return next(new ErrorHandler('Post Not Found', 404));

  const findPhoto = post.photos.id(photoId);

  if (!findPhoto)
    return next(new ErrorHandler('Photo Not Found Or Deleted', 404));

  post.photos.pull(photoId);

  await unlink(`uploads/images/posts/${filename}`);

  await post.save();

  res.status(200).json(post);
});

// Delete Post
exports.DeletePost = AsyncHandler(async (req, res, next) => {
  const { groupId, pageId } = req.body;

  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) return next(new ErrorHandler('Post Not Found Or Deleted', 404));

  for (let i = 0; i < post.photos.length; i++) {
    await unlink(`uploads/images/posts/${post.photos[i].filename}`);
  }

  if (groupId) {
    const group = await Group.findById(groupId);

    if (!group) return next(new ErrorHandler('Group Not Found', 404));

    group.posts.pull(post);

    await group.save();

    return res
      .status(200)
      .json({ status: 200, message: 'Post Deleted Successfully & From Group' });
  } else if (pageId) {
    const page = await Page.findById(pageId);

    if (!page) return next(new ErrorHandler('Page Not Found', 404));

    page.posts.pull(post);

    await page.save();

    return res
      .status(200)
      .json({ status: 200, message: 'Post Deleted Successfully & From Page' });
  } else {
    const user = await User.findById(req.user._id);

    if (!user) return next(new ErrorHandler('User Not Found', 404));

    user.posts.pull(post);

    await user.save();

    return res
      .status(200)
      .json({ status: 200, message: 'Post Deleted Successfully & From User' });
  }
});

// Like Post
exports.LikeAndDisLikePost = AsyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) return next(new ErrorHandler('Post Not Found', 404));

  if (post.likes.includes(req.user._id)) {
    post.likes.pull(req.user._id);
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();

  res.status(200).json(post);
});

// Comment Post
exports.CreateComment = AsyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) return next(new ErrorHandler('Post Not Found', 404));

  const comment = {
    text: req.body.text,
    user: req.user._id,
  };

  post.comments.push(comment);

  await post.save();

  res.status(200).json(post);
});

// Update Comment
exports.UpdateComment = AsyncHandler(async (req, res, next) => {
  const { commentId, text } = req.body;

  const post = await Post.findById(req.params.id);

  if (!post) return next(new ErrorHandler('Post Not Found', 404));

  const comment = post.comments.id(commentId);

  if (!comment) return next(new ErrorHandler('Comment Not Found', 404));

  comment.text = text;

  await post.save();

  res.status(200).json(post);
});

// Delete Comment
exports.DeleteComment = AsyncHandler(async (req, res, next) => {
  const { commentId } = req.body;

  const post = await Post.findById(req.params.id);

  if (!post) return next(new ErrorHandler('Post Not Found Or Deleted', 404));

  const comment = post.comments.find(
    (comment) => comment._id.toString() === commentId
  );

  if (!comment)
    return next(new ErrorHandler('Comment Not Found Or Deleted', 404));

  if (comment.user.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler('Unauthorized, This Operation For Comment Owner', 401)
    );
  }

  post.comments.pull(comment);

  await post.save();

  res.status(200).json(post);
});
