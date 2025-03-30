// start of backend/src/config/rateLimiter.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default; 
const redisClient = require('./redis');

let limiter;

if (process.env.NODE_ENV === 'test') {
  // Untuk testing, gunakan memory store dengan konfigurasi ketat
  const testLimiter = rateLimit({
    windowMs: 100, // 100ms untuk testing
    max: 5, // Hanya boleh 5 request per window
    skipFailedRequests: false,
    handler: (req, res) => {
      res.status(429).json({
        status: 'error',
        message: 'Terlalu banyak request, silakan coba lagi nanti'
      });
    },
  });

  limiter = {
    globalLimiter: testLimiter,
    authLimiter: testLimiter,
    apiLimiter: testLimiter
  };
} else {
  // Gunakan konfigurasi yang sudah ada untuk production/development
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100,
    message: {
      status: 'error',
      message: 'Terlalu banyak request dari IP ini, silakan coba lagi nanti'
    },
    legacyHeaders: false,
    standardHeaders: true
  });

  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 jam
    max: 5,
    handler: (req, res) => {
      res.status(429).json({
        status: 'error',
        message: 'Terlalu banyak percobaan, silakan coba lagi nanti'
      });
    }
  });

  const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 menit
    max: 50,
    message: {
      status: 'error',
      message: 'Terlalu banyak request API, silakan coba lagi nanti'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
  
  limiter = { globalLimiter, authLimiter, apiLimiter };
}

module.exports = limiter;
// end of backend/src/config/rateLimiter.js