const Page = require('../models/Page');
const Post = require('../models/Post');
const User = require('../models/User');
const AsyncHandler = require('../utils/AsyncHandler');
const ErrorHandler = require('../middleWares/ErrorHandler');
const { unlink } = require('node:fs/promises');

// Get All Pages
exports.GetAllPages = AsyncHandler(async (req, res, next) => {
  const pages = await Page.find();

  res.status(200).json(pages);
});

// Create Page
exports.CreatePage = AsyncHandler(async (req, res, next) => {
  const { name, bio } = req.body;

  const about = {
    bio,
  };

  const avatar = req.files.avatar[0];

  const cover = req.files.cover[0];

  const page = await Page.create({
    name,
    avatar,
    cover,
    about,
    owner: req.user._id,
  });

  res.status(200).json(page);
});

// Get Page By Id
exports.GetPageById = AsyncHandler(async (req, res, next) => {
  const page = await Page.findById(req.params.id);

  if (!page)
    return next(new ErrorHandler(`Page ${req.params.id} Not Found`, 404));

  res.status(200).json(page);
});

// Update Page
exports.UpdatePage = AsyncHandler(async (req, res, next) => {
  const { name, bio } = req.body;

  const about = {
    bio,
  };

  const avatar = req.files.avatar[0];

  const cover = req.files.cover[0];

  let page = await Page.findById(req.params.id);

  if (!page)
    return next(new ErrorHandler(`Page ${req.params.id} Not Found`, 404));

  if (avatar) {
    await unlink(`uploads/images/pages/${page.avatar.filename}`);
  }

  if (cover) {
    await unlink(`uploads/images/pages/${page.cover.filename}`);
  }

  page = await Page.findByIdAndUpdate(
    req.params.id,
    { name, avatar, cover, about },
    { new: true, runValidators: true }
  );

  res.status(200).json(page);
});

// Delete Page
exports.DeletePage = AsyncHandler(async (req, res, next) => {
  const page = await Page.findById(req.params.id);

  if (!page)
    return next(new ErrorHandler(`Page ${req.params.id} Not Found`, 404));

  await unlink(`uploads/images/pages/${page.avatar.filename}`);

  await unlink(`uploads/images/pages/${page.cover.filename}`);

  const pageOwner = await User.findById(page.owner._id.toString());

  pageOwner.groups.pull(page._id);

  await pageOwner.save();

  await Page.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Page Deleted Successfully' });
});

//** ---------------------------- Join & UnJoin Page ---------------------------- **\\

// Join & UnJoin Page
exports.JoinOrUnJoinPage = AsyncHandler(async (req, res, next) => {
  const page = await Page.findById(req.params.id);

  if (!page)
    return next(new ErrorHandler(`Page ${req.params.id} Not Found`, 404));

  const findMember = page.members.find(
    (member) => member.toString() === req.user._id.toString()
  );

  if (findMember) {
    page.members.pull(req.user._id);
    await page.save();
    return res.status(200).json({ message: 'UnJoined Page' });
  } else {
    page.members.push(req.user._id);

    await page.save();

    return res.status(200).json({ message: 'Joined Page' });
  }
});

//** ---------------------------- Add Page Admins ---------------------------- **\\

// Add A New Page Admin
exports.AddOrRemovePageAdmin = AsyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const user = await User.findOne({ _id: userId });

  if (!user)
    return next(new ErrorHandler(`This UserId ${userId} Not Found`, 404));

  const page = await Page.findById(req.params.id);

  if (!page) return next(new ErrorHandler('Page Not Found', 404));

  const findAdmin = page.admins.find(
    (admin) => admin._id.toString() === userId
  );

  if (findAdmin) {
    page.admins.pull(userId);
    await page.save();

    return res.status(200).json({ message: 'Removed Page Admin' });
  } else {
    page.admins.push(userId);

    await page.save();

    return res.status(200).json({ message: 'Added Page Admin' });
  }
});
