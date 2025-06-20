// start of backend/src/controllers/locationController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const locationController = {
  // Get semua provinsi
  getAllProvinces: async (req, res) => {
    try {
      const provinces = await prisma.province.findMany({
        include: {
          cities: true
        }
      });

      res.json({
        status: 'success',
        data: { provinces }
      });
    } catch (error) {
      console.error('Get provinces error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data provinsi'
      });
    }
  },

  // Get kota berdasarkan provinsi
  getCitiesByProvince: async (req, res) => {
    try {
      const { provinceId } = req.params;
      
      const cities = await prisma.city.findMany({
        where: { provinceId }
      });

      res.json({
        status: 'success',
        data: { cities }
      });
    } catch (error) {
      console.error('Get cities error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data kota'
      });
    }
  }
};

module.exports = locationController;
// end of backend/src/controllers/locationController.js