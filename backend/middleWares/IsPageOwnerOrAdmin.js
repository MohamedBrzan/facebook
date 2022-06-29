const Page = require('../models/Page');
const ErrorHandler = require('./ErrorHandler');
const AsyncHandler = require('../utils/AsyncHandler');

module.exports = AsyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const page = await Page.findById(req.params.id);

  if (!page)
    return next(
      new ErrorHandler(`This Page With Id ${req.params.id} Does Not Exist`, 404)
    );

  if (page.owner.toString() === req.user._id.toString()) {
    return next(
      new ErrorHandler(
        'Maybe You Not The Group Owner Or Not Allowed To You To Be An Admin',
        500
      )
    );
  } else if (userId === req.user._id.toString()) {
    return next(
      new ErrorHandler(
        'Maybe You Not The Group Owner Or Not Allowed To You To Be An Admin',
        500
      )
    );
  }

  next();
});
