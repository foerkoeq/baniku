// start of backend/src/utils/errors/AppError.js
class AppError extends Error {
    constructor(message, statusCode, data = null) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      this.data = data;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  // end of backend/src/utils/errors/AppError.js