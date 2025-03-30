// start of backend/src/controllers/baniController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { clearCache } = require('../middlewares/cache');

const baniController = {
  // Get all banis
  getAllBanis: async (req, res) => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const skip = (page - 1) * Number(limit);

      const where = {};
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } }
        ];
      }

      const [banis, total] = await Promise.all([
        prisma.bani.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            members: {
              select: {
                id: true,
                fullName: true
              }
            },
            events: true,
            photos: true
          }
        }),
        prisma.bani.count({ where })
      ]);

      res.json({
        status: 'success',
        data: {
          banis,
          pagination: {
            total,
            pages: Math.ceil(total / Number(limit)),
            page: Number(page),
            limit: Number(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get banis error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data bani'
      });
    }
  },

  // Get bani by ID
  getBaniById: async (req, res) => {
    try {
      const { id } = req.params;

      const bani = await prisma.bani.findUnique({
        where: { id },
        include: {
          members: {
            where: { deletedAt: null },
            include: {
              parent: {
                select: {
                  id: true,
                  fullName: true
                }
              },
              spouse: {
                select: {
                  id: true,
                  fullName: true
                }
              }
            }
          },
          events: {
            orderBy: {
              startDate: 'desc'
            }
          },
          photos: true
        }
      });

      if (!bani) {
        return res.status(404).json({
          status: 'error',
          message: 'Bani tidak ditemukan'
        });
      }

      res.json({
        status: 'success',
        data: { bani }
      });
    } catch (error) {
      console.error('Get bani error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data bani'
      });
    }
  },

  // Create new bani
  createBani: async (req, res) => {
    try {
      const { name, description } = req.body;

      // Check if bani with same name exists
      const existingBani = await prisma.bani.findUnique({
        where: { name }
      });

      if (existingBani) {
        return res.status(400).json({
          status: 'error',
          message: 'Nama Bani sudah digunakan'
        });
      }

      const bani = await prisma.bani.create({
        data: {
          name,
          description
        }
      });

      res.status(201).json({
        status: 'success',
        data: { bani }
      });
    } catch (error) {
      console.error('Create bani error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat membuat bani'
      });
    };
    await clearCache('banis*');
  },

  // Update bani
  updateBani: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      // Check if new name is already used by another bani
      if (name) {
        const existingBani = await prisma.bani.findFirst({
          where: {
            name,
            NOT: { id }
          }
        });

        if (existingBani) {
          return res.status(400).json({
            status: 'error',
            message: 'Nama Bani sudah digunakan'
          });
        }
      }

      const bani = await prisma.bani.update({
        where: { id },
        data: {
          name,
          description
        },
        include: {
          members: {
            select: {
              id: true,
              fullName: true
            }
          },
          events: true,
          photos: true
        }
      });

      res.json({
        status: 'success',
        data: { bani }
      });
    } catch (error) {
      console.error('Update bani error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengupdate bani'
      });
    };
    await clearCache('banis*');
  },

  // Delete bani
  deleteBani: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if bani has members
      const baniWithMembers = await prisma.bani.findUnique({
        where: { id },
        include: {
          _count: {
            select: { members: true }
          }
        }
      });

      if (baniWithMembers?._count.members > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Tidak dapat menghapus Bani yang masih memiliki anggota'
        });
      }

      await prisma.bani.delete({
        where: { id }
      });

      res.json({
        status: 'success',
        message: 'Bani berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete bani error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menghapus bani'
      });
    };
    await clearCache('banis*');
  },

  // Get bani statistics
  getBaniStats: async (req, res) => {
    try {
      const { id } = req.params;

      const bani = await prisma.bani.findUnique({
        where: { id },
        include: {
          members: {
            where: { deletedAt: null },
            select: {
              id: true,
              gender: true,
              status: true,
              maritalStatus: true,
              birthDate: true
            }
          }
        }
      });

      if (!bani) {
        return res.status(404).json({
          status: 'error',
          message: 'Bani tidak ditemukan'
        });
      }

      // Calculate statistics
      const stats = {
        totalMembers: bani.members.length,
        gender: {
          MALE: 0,
          FEMALE: 0,
          OTHER: 0
        },
        status: {
          ALIVE: 0,
          DECEASED: 0
        },
        maritalStatus: {
          SINGLE: 0,
          MARRIED: 0,
          DIVORCED: 0,
          WIDOWED: 0,
          REMARRIED: 0
        },
        ageGroups: {
          '0-18': 0,
          '19-35': 0,
          '36-50': 0,
          '51-70': 0,
          '70+': 0
        }
      };

      bani.members.forEach(member => {
        // Gender stats
        stats.gender[member.gender] = (stats.gender[member.gender] || 0) + 1;

        // Status stats
        stats.status[member.status] = (stats.status[member.status] || 0) + 1;

        // Marital status stats
        stats.maritalStatus[member.maritalStatus] = (stats.maritalStatus[member.maritalStatus] || 0) + 1;

        // Age stats
        if (member.birthDate) {
          const age = new Date().getFullYear() - member.birthDate.getFullYear();
          if (age <= 18) stats.ageGroups['0-18']++;
          else if (age <= 35) stats.ageGroups['19-35']++;
          else if (age <= 50) stats.ageGroups['36-50']++;
          else if (age <= 70) stats.ageGroups['51-70']++;
          else stats.ageGroups['70+']++;
        }
      });

      res.json({
        status: 'success',
        data: { stats }
      });
    } catch (error) {
      console.error('Get bani stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil statistik bani'
      });
    }
  }
};

module.exports = baniController;
// end of backend/src/controllers/baniController.js