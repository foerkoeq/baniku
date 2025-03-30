// start of backend/src/middlewares/notFound.js
const AppError = require('../utils/errors/AppError');

const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} tidak ditemukan`, 404));
};

module.exports = notFound;
// end of backend/src/middlewares/notFound.js