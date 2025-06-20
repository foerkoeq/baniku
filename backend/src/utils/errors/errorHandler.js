// start of backend/src/utils/errors/errorHandler.js
const AppError = require('./AppError');
const logger = require('../logger');

// Helper functions tetap sama
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : '';
  const message = `Data dengan nilai: "${value}" sudah ada. Mohon gunakan nilai lain`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Input tidak valid. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Token tidak valid. Silakan login kembali', 401);

const handleJWTExpiredError = () =>
  new AppError('Token Anda telah kedaluwarsa. Silakan login kembali', 401);

const sendErrorDev = (err, res) => {
  logger.error('Development Error:', {
    status: err.status,
    message: err.message,
    stack: err.stack
  });
  
  // For validation errors in test environment
  if (err.statusCode === 400 && err.data) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
      data: err.data
    });
  }

  // For 404 errors
  if (err.statusCode === 404) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

// Perbaiki sendErrorProd
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Set status ke 'fail' untuk validasi error (400)
    const status = err.statusCode === 400 ? 'fail' : 'error';
    
    res.status(err.statusCode).json({
      status: status,
      message: err.message,
      ...(err.data && { data: err.data })
    });
  } else {
    // Log error non-operational
    logger.error('Programming Error:', err);

    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    });
  }
};

// Main error handler
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error'; // Use existing status if set, fallback to 'error'

  // Untuk testing, kita ingin lihat error detail
  if (process.env.NODE_ENV === 'test') {
    sendErrorDev(err, res);
  }
  // Untuk development, tampilkan error detail
  else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } 
  // Untuk production, handle dengan aman
  else {
    let error = { ...err };
    error.message = err.message;
    error.status = 'error';

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
// end of backend/src/utils/errors/errorHandler.js