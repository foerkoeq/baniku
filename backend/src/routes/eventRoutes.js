// start of backend/src/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authMiddleware, roleCheck, baniAccess } = require('../middlewares/auth');
const { cacheMiddleware } = require('../middlewares/cache');


// Protected routes
router.use(authMiddleware);

// Cache GET routes selama 5 menit
router.get('/', cacheMiddleware(300), eventController.getAllEvents);
router.get('/:id', cacheMiddleware(300), eventController.getEventById);

// Routes yang mengubah data
router.post('/', roleCheck(['SUPER_ADMIN', 'ADMIN']), eventController.createEvent);
router.put('/:id', roleCheck(['SUPER_ADMIN', 'ADMIN']), eventController.updateEvent);
router.delete('/:id', roleCheck(['SUPER_ADMIN', 'ADMIN']), eventController.deleteEvent);


module.exports = router;
// end of backend/src/routes/eventRoutes.js