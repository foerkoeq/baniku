// start of backend/src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/prisma');
const { redisClient } = require('../config/redis');
const { debugUserRole } = require('../utils/debugUtils');

// Enum untuk Role
const Role = {
  SUPER_ADMIN: 1,
  ADMIN_BANI: 2,
  ADMIN_KELUARGA: 3,
  MEMBER: 4,
  GUEST: 5
};

// Helper functions untuk role
function hasAccessLevel(userRole, requiredLevel) {
  return userRole <= requiredLevel;
}

function isAdmin(role) {
  return role <= Role.ADMIN_KELUARGA;
}

function isSuperAdmin(role) {
  return role === Role.SUPER_ADMIN;
}

// Middleware untuk autentikasi
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('[Auth Middleware] Token tidak ditemukan');
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak ditemukan'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log('[Auth Middleware] Token tidak valid:', err.message);
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak valid'
      });
    }

    const cachedSession = await redisClient.get(`session:${decoded.userId}`);
    
    if (!cachedSession) {
      console.log('[Auth Middleware] Session tidak ditemukan di Redis');
      return res.status(401).json({
        status: 'error',
        message: 'Session tidak valid'
      });
    }
    
    console.log('[Auth Middleware] Session ditemukan:', cachedSession);
    const sessionData = JSON.parse(cachedSession);
    console.log('[Auth Middleware] Session data:', sessionData);

    // Get full user data from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        person: {
          select: {
            id: true,
            fullName: true,
            baniId: true
          }
        }
      }
    });

    if (!user || !user.isActive) {
      console.log('[Auth Middleware] User tidak valid atau tidak aktif');
      return res.status(401).json({
        status: 'error',
        message: 'User tidak valid atau tidak aktif'
      });
    }

    // Verify if the role in session matches the role in DB
    if (sessionData.role !== user.role) {
      console.log(`[Auth Middleware] Perbedaan role: Session=${sessionData.role}, DB=${user.role}`);
      // Update session with correct role
      await redisClient.setex(`session:${user.id}`, 86400, JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role
      }));
      console.log('[Auth Middleware] Session diperbarui dengan role yang benar');
    }

    // Debug user role before attaching to request
    debugUserRole(user);
    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware] Error:', error);
    next(error);
  }
};

// Middleware untuk pengecekan role
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    console.log(`[Role Check] Memeriksa role user: ${req.user.role}`);
    console.log(`[Role Check] Allowed roles: ${allowedRoles.join(', ')}`);
    
    // Convert string roles to numeric values for comparison
    const userRoleValue = Role[req.user.role];
    const allowedRoleValues = allowedRoles.map(role => Role[role]);
    
    // Check if user's role value is included in allowed role values
    if (!allowedRoleValues.includes(userRoleValue)) {
      console.log(`[Role Check] Akses ditolak untuk role: ${req.user.role}`);
      return res.status(403).json({
        status: 'error',
        message: 'Akses tidak diizinkan'
      });
    }
    
    console.log(`[Role Check] Akses diterima untuk role: ${req.user.role}`);
    next();
  };
};

// Middleware untuk mengecek akses Bani
const baniAccess = async (req, res, next) => {
  try {
    const { baniId } = req.params;
    const user = req.user;
    const userRoleValue = Role[user.role];

    console.log(`[Bani Access] Memeriksa akses ke Bani ID: ${baniId}`);
    console.log(`[Bani Access] User role: ${user.role}, User Bani: ${user.person?.baniId}`);

    // SUPER_ADMIN memiliki akses ke semua Bani
    if (isSuperAdmin(userRoleValue)) {
      console.log('[Bani Access] SUPER_ADMIN - akses diberikan');
      return next();
    }

    // ADMIN_BANI hanya bisa akses Bani yang dia kelola
    if (userRoleValue === Role.ADMIN_BANI) {
      if (user.person?.baniId === baniId) {
        console.log('[Bani Access] ADMIN_BANI - akses diberikan ke bani sendiri');
        return next();
      }
    }

    // ADMIN_KELUARGA dan MEMBER hanya bisa akses Bani mereka sendiri
    if (hasAccessLevel(userRoleValue, Role.ADMIN_KELUARGA)) {
      if (user.person?.baniId === baniId) {
        console.log(`[Bani Access] ${user.role} - akses diberikan ke bani sendiri`);
        return next();
      }
    }

    console.log('[Bani Access] Akses ditolak');
    return res.status(403).json({
      status: 'error',
      message: 'Anda tidak memiliki akses ke Bani ini'
    });
  } catch (error) {
    console.error('[Bani Access] Error:', error);
    next(error);
  }
};

module.exports = { authMiddleware, roleCheck, baniAccess };
// end of backend/src/middlewares/auth.js