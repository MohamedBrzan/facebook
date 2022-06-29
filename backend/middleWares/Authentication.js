const User = require('../models/User');
const Supporter = require('../models/Supporter');
const ErrorHandler = require('./ErrorHandler');
const AsyncHandler = require('../utils/AsyncHandler');
const jwt = require('jsonwebtoken');

const userAuthentication = AsyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token)
    return next(new ErrorHandler('Token Not Found Please Login First', 500));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded._id);

  next();
});

const SupporterAuthentication = AsyncHandler(async (req, res, next) => {
  const { supporterToken } = req.cookies;

  if (!supporterToken)
    return next(
      new ErrorHandler('SupporterToken Not Found Please Login First', 500)
    );

  const decoded = jwt.verify(supporterToken, process.env.JWT_SECRET_KEY);

  req.supporter = await Supporter.findById(decoded._id);

  next();
});

module.exports = { userAuthentication, SupporterAuthentication };
