// start of backend/src/middlewares/cache.js
const redisClient = require('../config/redis');

const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    // Skip caching untuk method selain GET
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await redisClient.get(key);
      
      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      // Override res.json untuk menyimpan response ke cache
      const originalJson = res.json;
      res.json = function(body) {
        redisClient.setex(key, duration, JSON.stringify(body));
        originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

// Utility untuk menghapus cache
const clearCache = async (pattern) => {
  try {
    // Skip untuk environment test
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const keys = await redisClient.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Clear cache error:', error);
  }
};

module.exports = { cacheMiddleware, clearCache };
// end of backend/src/middlewares/cache.js