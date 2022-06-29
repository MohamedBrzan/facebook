const ErrorHandler = require('./ErrorHandler');

// module.exports = (err, req, res, next) => {
//   if (err instanceof ErrorHandler) {
//     return res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   }
//   return res.status(500).json({
//     status: 'error',
//     message: 'Internal server error',
//   });
// };

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    const message = `Resource Not Found , Invalid ${err.path}`;
    return (err = new ErrorHandler(message, 400));
  }

  res
    .status(err.statusCode)
    .json({ status: err.statusCode, message: err.message });

  next();
};
