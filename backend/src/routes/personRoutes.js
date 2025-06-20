// start of backend/src/routes/personRoutes.js
const express = require('express');
const router = express.Router();
const personController = require('../controllers/personController');
const { authMiddleware, roleCheck, baniAccess } = require('../middlewares/auth'); // Tambahkan baniAccess
const { cacheMiddleware } = require('../middlewares/cache');
const validate = require('../middlewares/validate');
const { personSchema } = require('../validations/personSchema');

// GET routes - semua role bisa akses, tapi dengan filter data sesuai role mereka
router.get('/', 
  authMiddleware, 
  cacheMiddleware(300), 
  personController.getAllPersons   // Di controller akan filter sesuai role & bani
);

router.get('/tree/:id', 
  authMiddleware, 
  cacheMiddleware(300), 
  personController.getFamilyTree  // Di controller akan filter sesuai role & bani
);

router.get('/:id', 
  authMiddleware, 
  cacheMiddleware(300), 
  personController.getPersonById  // Di controller akan cek akses
);

// POST - SUPER_ADMIN bisa create di semua bani
// ADMIN_BANI hanya bisa create di baninya ke bawah
router.post('/', 
  authMiddleware, 
  roleCheck(['SUPER_ADMIN', 'ADMIN_BANI']),
  baniAccess, // Middleware untuk cek akses bani
  validate(personSchema),
  personController.createPerson
);

// PUT - SUPER_ADMIN bisa edit semua
// ADMIN_BANI hanya bisa edit di baninya ke bawah
// ADMIN_KELUARGA hanya bisa edit keluarganya
// MEMBER hanya bisa edit dirinya sendiri
router.put('/:id', 
  authMiddleware, 
  roleCheck(['SUPER_ADMIN', 'ADMIN_BANI', 'ADMIN_KELUARGA', 'MEMBER']),
  baniAccess, // Middleware untuk cek akses bani
  validate(personSchema),
  personController.updatePerson
);

// DELETE - SUPER_ADMIN bisa hapus semua
// ADMIN_BANI hanya bisa hapus di baninya ke bawah
router.delete('/:id', 
  authMiddleware, 
  roleCheck(['SUPER_ADMIN', 'ADMIN_BANI']),
  baniAccess, // Middleware untuk cek akses bani
  personController.deletePerson
);

module.exports = router;
// end of backend/src/routes/personRoutes.js