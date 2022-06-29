module.exports = (controllers) => (req, res, next) =>
  Promise.resolve(controllers(req, res, next)).catch(next);
