// start of backend/src/utils/logger.js
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Format log
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Transport untuk file
const fileRotateTransport = new DailyRotateFile({
  filename: path.join('logs', '%DATE%-app.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: logFormat
});

// Transport untuk error
const errorRotateTransport = new DailyRotateFile({
  filename: path.join('logs', '%DATE%-error.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
  format: logFormat
});

// Buat logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    fileRotateTransport,
    errorRotateTransport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Log uncaught exceptions
logger.exceptions.handle(
  new winston.transports.File({ 
    filename: path.join('logs', 'exceptions.log'),
    format: logFormat
  })
);

// Log unhandled rejections
logger.rejections.handle(
  new winston.transports.File({ 
    filename: path.join('logs', 'rejections.log'),
    format: logFormat
  })
);

module.exports = logger;
// end of backend/src/utils/logger.js