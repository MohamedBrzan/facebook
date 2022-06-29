const Supporter = require('../../models/Supporter');
const User = require('../../models/User');
const AsyncHandler = require('../../utils/AsyncHandler');
const ErrorHandler = require('../../middleWares/ErrorHandler');
const { unlink } = require('node:fs/promises');

// Get All Supporters
exports.GetAllSupporters = AsyncHandler(async (req, res, next) => {
  const supporters = await Supporter.find();

  return res.status(200).json(supporters);
});

// Get Supporter By Id
exports.GetSupporterById = AsyncHandler(async (req, res, next) => {
  const supporter = await Supporter.findById(req.params.id);

  if (!supporter) return next(new ErrorHandler('Supporter Not Found', 500));

  return res.status(200).json(supporter);
});

// Get Supporter Profile
exports.GetSupporterProfile = AsyncHandler(async (req, res, next) => {
  const supporter = await Supporter.findById(req.supporter._id);

  if (!supporter) return next(new ErrorHandler('Supporter Not Found', 500));

  return res.status(200).json(supporter);
});

// Update Supporter Profile
exports.UpdateSupporterProfile = AsyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const avatar = req.file;

  let supporter = await Supporter.findById(req.supporter._id);

  if (!supporter) return next(new ErrorHandler('Supporter Not Found', 500));

  await unlink(`uploads/images/supporters/${supporter.avatar.filename}`);

  supporter = await Supporter.findByIdAndUpdate(
    req.supporter._id,
    { name, email, avatar, password },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json(supporter);
});

//************************** Send Message To User **************************//

// Sent Message To User
exports.GetAllMessages = AsyncHandler(async (req, res, next) => {
  let supporter = await Supporter.findById(req.supporter._id);

  if (!supporter) return next(new ErrorHandler('Supporter Not Found', 500));

  return res.status(200).json(supporter.messages);
});

// Sent Message To User
exports.SentMessageToUser = AsyncHandler(async (req, res, next) => {
  const { userId, message } = req.body;

  let supporter = await Supporter.findById(req.supporter._id);

  if (!supporter) return next(new ErrorHandler('Supporter Not Found', 500));

  let user = await User.findById(userId);

  if (!user) return next(new ErrorHandler('User Not Found', 500));

  supporter.messages.push({
    user: userId,
    message,
  });

  await supporter.save();

  user.supporters.push({ supporter: req.supporter._id, message });

  await user.save();

  return res.status(200).json(supporter.messages);
});
