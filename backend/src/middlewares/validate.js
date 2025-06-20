// start of backend/src/middlewares/validate.js
const AppError = require('../utils/errors/AppError');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    
    next(new AppError('Validasi gagal', 400, validationErrors));
  }
};

module.exports = validate;
// end of backend/src/middlewares/validate.js