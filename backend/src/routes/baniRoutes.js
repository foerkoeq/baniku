// start of backend/src/routes/baniRoutes.js
const express = require('express');
const router = express.Router();
const baniController = require('../controllers/baniController');
const { authMiddleware, roleCheck, baniAccess } = require('../middlewares/auth');
const { cacheMiddleware } = require('../middlewares/cache');

// Protected routes - semua perlu authentication
router.use(authMiddleware);

// Cache selama 5 menit untuk data yang jarang berubah
router.get('/', cacheMiddleware(300), baniController.getAllBanis);
router.get('/:id', cacheMiddleware(300), baniController.getBaniById);
router.get('/:id/stats', cacheMiddleware(300), baniController.getBaniStats);

// Route yang mengubah data (tidak perlu cache)
router.post('/', roleCheck(['SUPER_ADMIN']), baniController.createBani);
router.put('/:id', roleCheck(['SUPER_ADMIN', 'ADMIN']), baniController.updateBani);
router.delete('/:id', roleCheck(['SUPER_ADMIN']), baniController.deleteBani);

module.exports = router;
// end of backend/src/routes/baniRoutes.js