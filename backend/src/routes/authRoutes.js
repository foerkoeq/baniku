// start of backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, roleCheck } = require('../middlewares/auth');
const { authLimiter } = require('../config/rateLimiter');
const validate = require('../middlewares/validate');
const { loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations/authSchema');

// Public routes
router.post('/login', validate(loginSchema), authLimiter, authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);

// Admin only routes
router.post('/register', 
  authMiddleware, 
  roleCheck(['SUPER_ADMIN', 'ADMIN']), 
  authController.register
);

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
        email: req.user.email,
        person: req.user.person
      }
    }
  });
});

module.exports = router;
// end of backend/src/routes/authRoutes.js