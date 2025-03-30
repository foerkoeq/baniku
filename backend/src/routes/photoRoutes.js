// start of backend/src/routes/photoRoutes.js
const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const { authMiddleware, roleCheck } = require('../middlewares/auth');
const upload = require('../config/upload');
const { cacheMiddleware } = require('../middlewares/cache');

router.use(authMiddleware);

// Cache untuk endpoint yang mengambil data foto
router.get('/:id', cacheMiddleware(300), photoController.getPhoto);
router.get('/person/:personId', cacheMiddleware(300), photoController.getPersonPhotos);
router.get('/bani/:baniId', cacheMiddleware(300), photoController.getBaniPhotos);

// Routes yang mengubah data tidak perlu cache
router.post('/', roleCheck(['SUPER_ADMIN', 'ADMIN']), upload.single('photo'), photoController.uploadPhoto);
router.delete('/:id', roleCheck(['SUPER_ADMIN', 'ADMIN']), photoController.deletePhoto);

module.exports = router;
// end of backend/src/routes/photoRoutes.js