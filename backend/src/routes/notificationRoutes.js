// start of backend/src/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { notificationController } = require('../controllers/notificationController');
const { authMiddleware } = require('../middlewares/auth');
const { cacheMiddleware } = require('../middlewares/cache');

router.use(authMiddleware);

// Cache notifications hanya 1 menit karena sering berubah
router.get('/', cacheMiddleware(60), notificationController.getUserNotifications);

// Routes yang mengubah data
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
// end of backend/src/routes/notificationRoutes.js