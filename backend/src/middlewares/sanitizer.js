// start of backend/src/middlewares/sanitizer.js
const xss = require('xss');

const sanitizeData = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeData(item));
  }
  
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = sanitizeData(obj[key]);
      return acc;
    }, {});
  }
  
  if (typeof obj === 'string') {
    return xss(obj);
  }
  
  return obj;
};

const sanitizer = (req, res, next) => {
  req.body = sanitizeData(req.body);
  req.query = sanitizeData(req.query);
  req.params = sanitizeData(req.params);
  next();
};

module.exports = sanitizer;
// end of backend/src/middlewares/sanitizer.js