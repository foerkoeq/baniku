// start of backend/src/controllers/notificationController.js
const { PrismaClient } = require('@prisma/client');
const redisClient = require('../config/redis');
const prisma = new PrismaClient();

const notificationController = {
  // Get notifikasi untuk user yang sedang login
  getUserNotifications: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * Number(limit);
      const userId = req.user.id;

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where: { userId },
          skip,
          take: Number(limit),
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.notification.count({
          where: { userId }
        })
      ]);

      res.json({
        status: 'success',
        data: {
          notifications,
          pagination: {
            total,
            pages: Math.ceil(total / Number(limit)),
            page: Number(page),
            limit: Number(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil notifikasi'
      });
    }
  },

  // Menandai notifikasi sebagai sudah dibaca
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await prisma.notification.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!notification) {
        return res.status(404).json({
          status: 'error',
          message: 'Notifikasi tidak ditemukan'
        });
      }

      await prisma.notification.update({
        where: { id },
        data: { isRead: true }
      });

      res.json({
        status: 'success',
        message: 'Notifikasi ditandai sebagai sudah dibaca'
      });
    } catch (error) {
      console.error('Mark notification error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menandai notifikasi'
      });
    }
  },

  // Menandai semua notifikasi sebagai sudah dibaca
  markAllAsRead: async (req, res) => {
    try {
      const userId = req.user.id;

      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false
        },
        data: { isRead: true }
      });

      res.json({
        status: 'success',
        message: 'Semua notifikasi ditandai sebagai sudah dibaca'
      });
    } catch (error) {
      console.error('Mark all notifications error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menandai semua notifikasi'
      });
    }
  },

  // Menghapus notifikasi
  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await prisma.notification.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!notification) {
        return res.status(404).json({
          status: 'error',
          message: 'Notifikasi tidak ditemukan'
        });
      }

      await prisma.notification.delete({
        where: { id }
      });

      res.json({
        status: 'success',
        message: 'Notifikasi berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menghapus notifikasi'
      });
    }
  }
};

// Utility function untuk membuat notifikasi
const createNotification = async (userId, title, message) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        isRead: false
      }
    });

    // Cache notifikasi di Redis untuk performa
    await redisClient.setex(
      `notification:${notification.id}`,
      3600, // expired dalam 1 jam
      JSON.stringify(notification)
    );

    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

module.exports = {
  notificationController,
  createNotification
};
// end of backend/src/controllers/notificationController.js