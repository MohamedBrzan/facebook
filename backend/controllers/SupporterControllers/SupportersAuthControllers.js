const Supporter = require('../../models/Supporter');
const AsyncHandler = require('../../utils/AsyncHandler');
const { sendSupporterToken } = require('../../utils/SendToken');
const ErrorHandler = require('../../middleWares/ErrorHandler');

// Register Supporter
exports.Register = AsyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const avatar = req.file;

  let supporter = await Supporter.findOne({ email });

  if (supporter) return next(new ErrorHandler('Supporter Already Exists', 500));

  supporter = await Supporter.create({
    name,
    email,
    avatar,
    password,
  });

  return sendSupporterToken(res, supporter, 200);
});

// Login Supporter
exports.Login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  let supporter = await Supporter.findOne({ email });

  if (!supporter) return next(new ErrorHandler('Supporter Not Found', 500));

  const isMatch = supporter.comparePassword(password);

  if (!isMatch) return next(new ErrorHandler('Invalid Password', 500));

  return sendSupporterToken(res, supporter, 200);
});

// LoggedIn Supporter
exports.LoggedIn = AsyncHandler(async (req, res, next) => {
  const { supporterToken } = req.cookies;

  if (!supporterToken)
    return next(new ErrorHandler('SupporterToken Not Found Please Login', 500));

  const supporter = await Supporter.findOne({ supporterToken });

  if (!supporter) return next(new ErrorHandler('Supporter Not Found', 500));

  return res.status(200).json(supporter);
});

// Logout Supporter
exports.Logout = AsyncHandler(async (req, res, next) => {
  const { supporterToken } = req.cookies;

  if (!supporterToken)
    return next(new ErrorHandler('SupporterToken Not Found Please Login', 500));

  return res
    .status(200)
    .cookie('supporterToken', '', { expires: new Date(0) })
    .json({ status: 200, message: 'Supporter Logout Successfully' });
});
