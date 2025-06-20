// start of backend/src/controllers/photoController.js
const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

const photoController = {
  // Get single photo
  getPhoto: async (req, res) => {
    try {
      const { id } = req.params;

      const photo = await prisma.photo.findUnique({
        where: { id }
      });

      if (!photo) {
        return res.status(404).json({
          status: 'error',
          message: 'Foto tidak ditemukan'
        });
      }

      res.json({
        status: 'success',
        data: { photo }
      });
    } catch (error) {
      console.error('Get photo error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil foto'
      });
    }
  },

  // Get photos by person
  getPersonPhotos: async (req, res) => {
    try {
      const { personId } = req.params;

      const photos = await prisma.photo.findMany({
        where: { personId }
      });

      res.json({
        status: 'success',
        data: { photos }
      });
    } catch (error) {
      console.error('Get person photos error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil foto'
      });
    }
  },

  // Get photos by bani
  getBaniPhotos: async (req, res) => {
    try {
      const { baniId } = req.params;

      const photos = await prisma.photo.findMany({
        where: { baniId }
      });

      res.json({
        status: 'success',
        data: { photos }
      });
    } catch (error) {
      console.error('Get bani photos error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil foto'
      });
    }
  },

  // Upload foto
  uploadPhoto: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'Tidak ada file yang diupload'
        });
      }

      const { personId, baniId, caption } = req.body;
      const originalPath = req.file.path;
      
      // Optimize foto menggunakan sharp
      const optimizedFileName = `optimized-${req.file.filename}`;
      const optimizedPath = path.join('uploads/photos', optimizedFileName);
      
      await sharp(originalPath)
        .resize(800) // Resize max width 800px
        .jpeg({ quality: 80 }) // Compress quality
        .toFile(optimizedPath);

      // Hapus file original
      await fs.unlink(originalPath);

      // Simpan data foto ke database
      const photo = await prisma.photo.create({
        data: {
          url: optimizedFileName,
          caption,
          ...(personId && { person: { connect: { id: personId } } }),
          ...(baniId && { bani: { connect: { id: baniId } } })
        }
      });

      res.status(201).json({
        status: 'success',
        data: { photo }
      });
    } catch (error) {
      console.error('Upload photo error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat upload foto'
      });
    }
  },

  // Hapus foto
  deletePhoto: async (req, res) => {
    try {
      const { id } = req.params;

      const photo = await prisma.photo.findUnique({
        where: { id }
      });

      if (!photo) {
        return res.status(404).json({
          status: 'error',
          message: 'Foto tidak ditemukan'
        });
      }

      // Hapus file fisik
      await fs.unlink(path.join('uploads/photos', photo.url));

      // Hapus data dari database
      await prisma.photo.delete({
        where: { id }
      });

      res.json({
        status: 'success',
        message: 'Foto berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete photo error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menghapus foto'
      });
    }
  }
};

module.exports = photoController;
// end of backend/src/controllers/photoController.js