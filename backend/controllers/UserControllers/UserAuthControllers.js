const User = require('../../models/User');
const AsyncHandler = require('../../utils/AsyncHandler');
const { sendUserToken } = require('../../utils/SendToken');
const ErrorHandler = require('../../middleWares/ErrorHandler');

// Register User
exports.Register = AsyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const avatar = req.files.avatar[0];

  const cover = req.files.cover[0];

  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler('User Already Exists', 500));

  user = await User.create({ name, email, avatar, cover, password });

  return sendUserToken(res, user, 200);
});

// Login User
exports.Login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler('User Not Found', 500));

  const isMatch = user.comparePassword(password);

  if (!isMatch) return next(new ErrorHandler('Invalid Password', 500));

  return sendUserToken(res, user, 200);
});

// LoggedIn User
exports.LoggedIn = AsyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token)
    return next(new ErrorHandler('Token Not Found Please Login', 500));

  const user = await User.findOne({ token });

  if (!user) return next(new ErrorHandler('User Not Found', 500));

  return res.status(200).json(user);
});

// Logout User
exports.Logout = AsyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token)
    return next(new ErrorHandler('Token Not Found Please Login', 500));

  return res
    .status(200)
    .cookie('token', '', { expires: new Date(0) })
    .json({ status: 200, message: 'Logout Successfully' });
});
