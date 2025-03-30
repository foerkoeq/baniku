// start of backend/src/routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authMiddleware } = require('../middlewares/auth');
const { cacheMiddleware } = require('../middlewares/cache');

router.use(authMiddleware);

// Cache selama 1 hari karena data lokasi jarang berubah
router.get('/provinces', cacheMiddleware(86400), locationController.getAllProvinces);
router.get('/provinces/:provinceId/cities', cacheMiddleware(86400), locationController.getCitiesByProvince);

module.exports = router;
// end of backend/src/routes/locationRoutes.js