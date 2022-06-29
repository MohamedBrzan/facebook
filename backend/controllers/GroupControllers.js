const Group = require('../models/Group');
const Post = require('../models/Post');
const User = require('../models/User');
const AsyncHandler = require('../utils/AsyncHandler');
const ErrorHandler = require('../middleWares/ErrorHandler');
const { unlink } = require('node:fs/promises');

// Get All Groups
exports.GetAllGroups = AsyncHandler(async (req, res, next) => {
  const groups = await Group.find();

  res.status(200).json(groups);
});

// Create Group
exports.CreateGroup = AsyncHandler(async (req, res, next) => {
  const { name, bio } = req.body;

  const about = {
    bio,
  };

  const avatar = req.files.avatar[0];

  const cover = req.files.cover[0];

  const group = await Group.create({
    name,
    avatar,
    cover,
    about,
    owner: req.user._id,
  });

  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler('User not found', 404));

  user.groups.push(group);

  await user.save();

  res.status(200).json(group);
});

// Get Group By Id
exports.GetGroupById = AsyncHandler(async (req, res, next) => {
  const group = await Group.findById(req.params.id);

  if (!group)
    return next(new ErrorHandler(`Group ${req.params.id} not found`, 404));

  res.status(200).json(group);
});

// Update Group
exports.UpdateGroup = AsyncHandler(async (req, res, next) => {
  const { name, bio } = req.body;

  const about = {
    bio,
  };

  const avatar = req.files.avatar[0];

  const cover = req.files.cover[0];

  let group = await Group.findById(req.params.id);

  if (!group)
    return next(new ErrorHandler(`Group ${req.params.id} Not Found`, 404));

  if (avatar) {
    await unlink(`uploads/images/groups/${group.avatar.filename}`);
  }

  if (cover) {
    await unlink(`uploads/images/groups/${group.cover.filename}`);
  }

  group = await Group.findByIdAndUpdate(
    req.params.id,
    { name, avatar, cover, about },
    { new: true, runValidators: true }
  );

  res.status(200).json(group);
});

// Delete Group
exports.DeleteGroup = AsyncHandler(async (req, res, next) => {
  const group = await Group.findById(req.params.id);

  if (!group)
    return next(new ErrorHandler(`Group ${req.params.id} Not Found`, 404));

  await unlink(`uploads/images/groups/${group.avatar.filename}`);

  await unlink(`uploads/images/groups/${group.cover.filename}`);

  const groupOwner = await User.findById(group.owner._id.toString());

  groupOwner.groups.pull(group._id);

  await groupOwner.save();

  await Group.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Group Deleted Successfully' });
});

//** ---------------------------- Follow & UnFollow Group ---------------------------- **\\

// Follow & UnFollow Group
exports.FollowOrUnFollowGroup = AsyncHandler(async (req, res, next) => {
  const group = await Group.findById(req.params.id);

  if (!group)
    return next(new ErrorHandler(`Group ${req.params.id} not found`, 404));

  const findFollower = group.followers.find(
    (follower) => follower.toString() === req.user._id.toString()
  );

  if (findFollower) {
    group.followers.pull(req.user._id);
    await group.save();
    return res.status(200).json({ message: 'UnFollowed Group' });
  } else {
    group.followers.push(req.user._id);

    await group.save();

    return res.status(200).json({ message: 'Followed Group' });
  }
});

//** ---------------------------- Join & UnJoin Group ---------------------------- **\\

// Join & UnJoin Group
exports.JoinOrUnJoinGroup = AsyncHandler(async (req, res, next) => {
  const group = await Group.findById(req.params.id);

  if (!group)
    return next(new ErrorHandler(`Group ${req.params.id} not found`, 404));

  const findMember = group.members.find(
    (member) => member.toString() === req.user._id.toString()
  );

  if (findMember) {
    group.members.pull(req.user._id);
    await group.save();
    return res.status(200).json({ message: 'UnJoined Group' });
  } else {
    group.members.push(req.user._id);

    await group.save();

    return res.status(200).json({ message: 'Joined Group' });
  }
});

//** ---------------------------- Add Group Admins ---------------------------- **\\

// Add A New Group Admin
exports.AddOrRemoveGroupAdmin = AsyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const user = await User.findOne({ _id: userId });

  if (!user)
    return next(new ErrorHandler(`This UserId ${userId} Not Found`, 404));

  const group = await Group.findById(req.params.id);

  if (!group) return next(new ErrorHandler('Group Not Found', 404));

  const findAdmin = group.admins.find(
    (admin) => admin._id.toString() === userId
  );

  if (findAdmin) {
    group.admins.pull(userId);
    await group.save();

    return res.status(200).json({ message: 'Removed Group Admin' });
  } else {
    group.admins.push(userId);

    await group.save();

    return res.status(200).json({ message: 'Added Group Admin' });
  }
});
