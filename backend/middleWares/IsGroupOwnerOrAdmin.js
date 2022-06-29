const Group = require('../models/Group');
const ErrorHandler = require('./ErrorHandler');
const AsyncHandler = require('../utils/AsyncHandler');

module.exports = AsyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const group = await Group.findById(req.params.id);

  if (!group)
    return next(
      new ErrorHandler(
        `This Group With Id ${req.params.id} Does Not Exist`,
        404
      )
    );

  if (!group.owner.toString() === req.user._id.toString()) {
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
