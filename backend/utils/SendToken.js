const sendUserToken = (res, user, status) => {
  const token = user.generateUserToken();
  const option = {
    expiresIn: new Date(
      Date.now() + process.env.COOKIE_EXPIRE_IN * 24 * 60 * 60 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    option.secure = true;
  }

  res.status(status).cookie('token', token, option).json({
    status,
    token,
    user,
  });
};

const sendSupporterToken = (res, supporter, status) => {
  const supporterToken = supporter.generateSupporterToken();
  const option = {
    expiresIn: new Date(
      Date.now() + process.env.COOKIE_EXPIRE_IN * 24 * 60 * 60 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    option.secure = true;
  }

  res.status(status).cookie('supporterToken', supporterToken, option).json({
    status,
    supporterToken,
    supporter,
  });
};

module.exports = { sendUserToken, sendSupporterToken };
