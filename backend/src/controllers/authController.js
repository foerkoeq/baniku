// start of backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const redisClient = require('../config/redis');
const AppError = require('../utils/errors/AppError');
const { debugLoginResponse } = require('../utils/debugUtils');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// Setup email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const authController = {
  // Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      console.log(`[Auth] Mencoba login dengan username: ${username}`);

      const user = await prisma.user.findUnique({
        where: { username },
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
        console.log(`[Auth] Username tidak ditemukan atau user tidak aktif: ${username}`);
        return res.status(401).json({
          status: 'error',
          message: 'Username atau password salah'
        });
      }

      console.log(`[Auth] User ditemukan - ID: ${user.id}, Role: ${user.role}`);

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log(`[Auth] Password salah: ${username}`);
        return res.status(401).json({
          status: 'error',
          message: 'Username atau password salah'
        });
      }

      const token = generateToken(user.id);

      // Cache user session di Redis
      await redisClient.setex(`session:${user.id}`, 86400, JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role
      }));

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      // Data yang akan dikirim ke client
      const userData = {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        person: user.person
    };
    
    // Debug response sebelum dikirim
    debugLoginResponse(token, userData);

      res.json({
        status: 'success',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            person: user.person
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat login'
      });
    }
  },

// Endpoint untuk mendapatkan user berdasarkan token
getMe: async (req, res) => {
  try {
      // req.user sudah diisi oleh middleware auth
      const { user } = req;
      
      // Debug sebelum mengirim response
      console.log('[Auth] GET /me - User data:', {
          id: user.id,
          username: user.username,
          role: user.role
      });
      
      res.json({
          status: 'success',
          data: {
              user: {
                  id: user.id,
                  username: user.username,
                  role: user.role,
                  email: user.email,
                  person: user.person
              }
          }
      });
  } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
          status: 'error',
          message: 'Terjadi kesalahan saat mengambil data user'
      });
  }
},

  // Register user (hanya untuk SUPER_ADMIN dan ADMIN)
  register: async (req, res) => {
    try {
      const {
        username,
        password,
        email,
        role,
        personId 
      } = req.body;

      // Cek apakah username atau email sudah ada
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Username atau email sudah digunakan'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          email,
          role,
          person: personId ? {
            connect: { id: personId }
          } : undefined
        },
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

      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
            email: newUser.email,
            person: newUser.person
          }
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat registrasi user'
      });
    }
  },

  // Forgot Password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          person: {
            select: {
              fullName: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Email tidak ditemukan'
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = await bcrypt.hash(resetToken, SALT_ROUNDS);

      // Simpan token ke Redis dengan expiry 1 jam
      await redisClient.setex(`reset:${user.id}`, 3600, hashedToken);

      // Kirim email reset password
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
      
      await transporter.sendMail({
        to: email,
        subject: 'Reset Password - Aplikasi Bani',
        html: `
          <p>Halo ${user.person?.fullName || user.username},</p>
          <p>Anda meminta untuk reset password akun Anda.</p>
          <p>Klik link berikut untuk reset password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Link ini akan kadaluarsa dalam 1 jam.</p>
          <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        `
      });

      res.json({
        status: 'success',
        message: 'Link reset password telah dikirim ke email Anda'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat memproses permintaan reset password'
      });
    }
  },

  // Reset Password
  resetPassword: async (req, res) => {
    try {
      const { token, email, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'Email tidak valid'
        });
      }

      // Get stored token from Redis
      const storedToken = await redisClient.get(`reset:${user.id}`);
      if (!storedToken) {
        return res.status(400).json({
          status: 'error',
          message: 'Token reset password tidak valid atau sudah kadaluarsa'
        });
      }

      const isValidToken = await bcrypt.compare(token, storedToken);
      if (!isValidToken) {
        return res.status(400).json({
          status: 'error',
          message: 'Token reset password tidak valid'
        });
      }

      // Hash password baru
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // Update password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });

      // Hapus token dari Redis
      await redisClient.del(`reset:${user.id}`);

      res.json({
        status: 'success',
        message: 'Password berhasil direset'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat reset password'
      });
    }
  },

  // Logout
  logout: async (req, res) => {
    try {
      const userId = req.user.id;
      // Hapus session dari Redis
      await redisClient.del(`session:${userId}`);
      
      res.json({
        status: 'success',
        message: 'Berhasil logout'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat logout'
      });
    }
  }
};

module.exports = authController;
// end of backend/src/controllers/authController.js