const User = require('../../models/User');
const AsyncHandler = require('../../utils/AsyncHandler');
const ErrorHandler = require('../../middleWares/ErrorHandler');
const { unlink } = require('node:fs/promises');

// Get All Users
exports.GetAllUsers = AsyncHandler(async (req, res, next) => {
  const users = await User.find();

  return res.status(200).json(users);
});

// Get User By Id
exports.GetUserById = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new ErrorHandler('User Not Found', 500));

  return res.status(200).json(user);
});

// Get User Profile
exports.GetUserProfile = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler('User Not Found', 500));

  return res.status(200).json(user);
});

// Update User Profile
exports.UpdateUserProfile = AsyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const avatar = req.files.avatar[0];

  const cover = req.files.cover[0];

  let user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler('User Not Found', 500));

  if (avatar) {
    await unlink(`uploads/images/users/${user.avatar.filename}`);
  }

  if (cover) {
    await unlink(`uploads/images/users/${user.cover.filename}`);
  }

  user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email, avatar, cover, password },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json(user);
});

//** ---------------------------- Follow & UnFollow User ---------------------------- **\\

// Follow & UnFollow User
exports.FollowOrUnFollowUser = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user)
    return next(new ErrorHandler(`User ${req.user._id} Not Found`, 404));

  const userToFollow = await User.findById(req.params.id);

  if (!userToFollow)
    return next(
      new ErrorHandler(`User To Follow${req.params.id} Not Found`, 404)
    );

  if (userToFollow._id.toString() === user._id.toString())
    return next(new ErrorHandler(`You Can't Follow Yourself`, 500));

  const findFollowing = user.followings.find(
    (following) => following._id.toString() === userToFollow._id.toString()
  );

  const findFollower = userToFollow.followers.find(
    (follower) => follower._id.toString() === req.user._id.toString()
  );

  if (findFollowing && findFollower) {
    user.followings.pull(userToFollow._id);
    await user.save();
    userToFollow.followers.pull(user._id.toString());
    await userToFollow.save();
    return res.status(200).json({ message: 'UnFollowed User' });
  } else {
    user.followings.push(userToFollow._id);
    await user.save();
    console.log(user.followings);
    userToFollow.followers.push(user._id);
    await userToFollow.save();
    return res.status(200).json({ message: 'Followed User' });
  }
});

//** ---------------------------- Delete All User Notifications ---------------------------- **\\

// Delete All User Notifications
exports.DeleteAllUserNotifications = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler('User Not Found', 404));

  user.notifications = [];

  await user.save();

  res.status(200).json(user.notifications);
});

//** ---------------------------- Send Message To User ---------------------------- **\\

// Send Message To User Notifications
exports.SendMessageToUser = AsyncHandler(async (req, res, next) => {
  const { userId, message } = req.body;

  const sender = await User.findById(req.user._id);

  if (!sender) return next(new ErrorHandler('Sender Not Found', 404));

  const consignee = await User.findById(userId);

  if (!consignee)
    return next(new ErrorHandler('Consignee User Not Found', 404));

  if (!userId) return next(new ErrorHandler('Please! Insert UserId', 404));

  if (!message) return next(new ErrorHandler('Please! Insert Message', 404));

  if (userId === req.user._id.toString())
    return next(new ErrorHandler(`You Can't Send Message To Yourself`, 500));

  sender.messages.push({ consignee, message });

  consignee.messages.push({ sender, message });

  await consignee.save();

  await sender.save();

  res.status(200).json({ message: 'Message Sent To Consignee' });
});

//** ---------------------------- Blocking User ---------------------------- **\\

// Get All Blocked Users
exports.GetAllBlockedUsers = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler('User Not Found', 404));

  res.status(200).json(user.blocked);
});

// Blocking User
exports.BlockingUser = AsyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler('User Not Found', 404));

  const userToBlock = await User.findById(userId);

  if (!userToBlock)
    return next(new ErrorHandler('User To Block Not Found', 404));

  const findBlockedUSer = user.blocked.find(
    (blocked) => blocked._id.toString() === userId
  );

  if (findBlockedUSer) {
    return next(new ErrorHandler('User Already Blocked', 404));
  } else {
    user.blocked.push(userId);

    await user.save();

    res.status(200).json(user.blocked);
  }
});

// Delete Blocking User
exports.DeleteBlockingUser = AsyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler('User Not Found', 404));

  const userToBlock = await User.findById(userId);

  if (!userToBlock)
    return next(new ErrorHandler('User To Block Not Found', 404));

  const findBlockedUSer = user.blocked.find(
    (blocked) => blocked._id.toString() === userId
  );

  if (findBlockedUSer) {
    user.blocked.pull(userId);

    await user.save();

    return res.status(200).json({
      message: `User With Id ${userId} Was Deleted Successfully From Your Blocks`,
    });
  } else {
    return res.status(200).json({
      message: `User With Id ${userId} Was Not Found In Your Blocks`,
    });
  }
});

//** ---------------------------- Toggle Account Private Status ---------------------------- **\\

// Toggle Private Status
exports.TogglePrivateStatus = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler('User Not Found', 404));

  if (user.isPrivate === true) {
    user.isPrivate = false;

    await user.save();

    return res.status(200).json({
      message: 'Your Account Is Public Now',
    });
  } else {
    user.isPrivate = true;

    await user.save();

    return res.status(200).json({
      message: 'Your Account Is Private Now',
    });
  }
});

//** ---------------------------- Toggle Account Online Status ---------------------------- **\\

// Toggle Online Status
exports.ToggleOnlineStatus = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler('User Not Found', 404));

  if (user.isOnline === true) {
    user.isOnline = false;

    await user.save();

    return res.status(200).json({
      message: 'Your Account Is Offline Now',
    });
  } else {
    user.isOnline = true;

    await user.save();

    return res.status(200).json({
      message: 'Your Account Is Online Now',
    });
  }
});

//** ---------------------------- Toggle Account Verified Status ---------------------------- **\\

// Toggle Verified Status
exports.ToggleVerifiedStatus = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler('User Not Found', 404));

  if (user.isVerified === true) {
    user.isVerified = false;

    await user.save();

    return res.status(200).json({
      message: 'Your Account Is Not Verified Now',
    });
  } else {
    user.isVerified = true;

    await user.save();

    return res.status(200).json({
      message: 'Your Account Is Verified Now',
    });
  }
});

//** ---------------------------- Toggle Account Deleted Status ---------------------------- **\\

// Toggle Deleted Status
exports.ToggleDeletedStatus = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler('User Not Found', 404));

  if (user.isDeleted === true) {
    user.isDeleted = false;

    await user.save();

    return res.status(200).json({
      message: 'Your Account Is Safe Now',
    });
  } else {
    user.isDeleted = true;

    await user.save();

    return res.status(200).json({
      message: 'Your Account Is Will Deleted After 30 Days',
    });
  }
});
