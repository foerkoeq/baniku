// start of backend/src/config/redis.js
const { connect } = require('http2');
const Redis = require('ioredis');
const { disconnect } = require('process');

let redisClient;

// Cek environment
if (process.env.NODE_ENV === 'test') {
  // Mock Redis untuk testing
  redisClient = {
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    call: jest.fn()
  };
} else {
  // Real Redis client untuk development/production
  redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || 'Foerkoeqrb3!',
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    console.log(`Redis connection lost, retrying in ${delay}ms, Attempt ${times}`);
    return delay;
  },
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  connectTimeout: 10000,
  disconnectTimeout: 2000,
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    if (err.message.slice(0, targetError.length) === targetError) {
      // Only reconnect when the error starts with "READONLY"
      return true;
    }
  }
});

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

redisClient.on('reconnecting', () => {
  console.log('Redis client reconnecting');
});

redisClient.on('end', () => {
  console.log('Redis connection ended');
});

}
module.exports = redisClient;
// end of backend/src/config/redis.js