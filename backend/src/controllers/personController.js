// start of backend/src/controllers/personController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createNotification } = require('./notificationController');
const { clearCache } = require('../middlewares/cache');
const bcrypt = require('bcryptjs');
const { generateDefaultUsername, determineUserRole } = require('../utils/userHelper');
const AppError = require('../utils/errors/AppError');


const personController = {
  // Get all persons (with pagination and filters)
  getAllPersons: async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search,
        baniId,
        status,
        gender 
      } = req.query;

      const skip = (page - 1) * Number(limit);
      
      // Build where clause
      const where = {
        deletedAt: null, // Tidak tampilkan yang sudah dihapus
        AND: []
      };

      if (search) {
        where.AND.push({
          OR: [
            { fullName: { contains: search } },
            { address: { contains: search } }
          ]
        });
      }

      if (baniId) {
        where.baniId = baniId;
      }

      if (status) {
        where.status = status;
      }

      if (gender) {
        where.gender = gender;
      }

      const [persons, total] = await Promise.all([
        prisma.person.findMany({
          where,
          skip,
          take: Number(limit),
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
            },
            children: {
              select: {
                id: true,
                fullName: true
              }
            },
            previousMarriages: true,
            photos: true,
            bani: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            fullName: 'asc'
          }
        }),
        prisma.person.count({ where })
      ]);

      res.json({
        status: 'success',
        data: {
          persons,
          pagination: {
            total,
            pages: Math.ceil(total / Number(limit)),
            page: Number(page),
            limit: Number(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get persons error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data person'
      });
    }
  },

  // Get person by ID
  getPersonById: async (req, res) => {
    try {
      const { id } = req.params;

      const person = await prisma.person.findUnique({
        where: { id },
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
          },
          children: {
            select: {
              id: true,
              fullName: true
            }
          },
          previousMarriages: true,
          photos: true,
          bani: {
            select: {
              id: true,
              name: true
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              role: true
            }
          }
        }
      });

      if (!person || person.deletedAt) {
        return res.status(404).json({
          status: 'error',
          message: 'Person tidak ditemukan'
        });
      }

      res.json({
        status: 'success',
        data: { person }
      });
    } catch (error) {
      console.error('Get person error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data person'
      });
    }
  },

  // Create new person
  createPerson: async (req, res, next) => {
    try {
      const {
        titlePrefix,
        fullName,
        titleSuffix,
        gender,
        birthPlace,
        birthDate,
        status,
        address,
        phone,
        maritalStatus,
        story,
        parentId,
        spouseId,
        baniId,
        provinceId,
        cityId,
        isBani,
        familyRole
      } = req.body;
  
      let userData = null;
  
      // Generate user account jika ada tanggal lahir
      if (birthDate) {
        try {
          // Generate username default
          const defaultUsername = generateDefaultUsername(fullName, new Date(birthDate));
          
          // Check username already exists
          const existingUser = await prisma.user.findUnique({
            where: { username: defaultUsername }
          });
  
          if (existingUser) {
            throw new AppError('Username sudah digunakan', 400);
          }
  
          // Default password: bani1234
          const defaultPassword = await bcrypt.hash('bani1234', 10);
          
          // Determine role based on isBani and familyRole
          const role = determineUserRole({ isBani, familyRole });
  
          // Create user
          userData = await prisma.user.create({
            data: {
              username: defaultUsername,
              password: defaultPassword,
              role,
              isActive: true
            }
          });
  
          logger.info('User account created:', {
            username: defaultUsername,
            role,
            personName: fullName
          });
  
        } catch (error) {
          logger.error('Error creating user account:', error);
          throw new AppError('Gagal membuat akun user', 500);
        }
      }
  
      // Create person with all relationships
      const person = await prisma.person.create({
        data: {
          titlePrefix,
          fullName,
          titleSuffix,
          gender,
          birthPlace,
          birthDate: birthDate ? new Date(birthDate) : null,
          status,
          address,
          phone,
          maritalStatus,
          story,
          isBani: isBani || false,
          familyRole: familyRole || 'MEMBER',
          parent: parentId ? {
            connect: { id: parentId }
          } : undefined,
          spouse: spouseId ? {
            connect: { id: spouseId }
          } : undefined,
          bani: {
            connect: { id: baniId }
          },
          province: provinceId ? {
            connect: { id: provinceId }
          } : undefined,
          city: cityId ? {
            connect: { id: cityId }
          } : undefined,
          user: userData ? {
            connect: { id: userData.id }
          } : undefined,
          createdBy: {
            connect: { id: req.user.id }
          },
          updatedBy: {
            connect: { id: req.user.id }
          }
        },
        include: {
          parent: true,
          spouse: true,
          children: true,
          bani: true,
          province: true,
          city: true,
          user: {
            select: {
              id: true,
              username: true,
              role: true
            }
          }
        }
      });
  
      // Create notifications
      await Promise.all([
        // Notifikasi untuk admin
        createNotification(
          req.user.id,
          'Anggota Baru',
          `Anggota baru telah ditambahkan: ${fullName}`
        ),
        // Notifikasi untuk user baru jika akun dibuat
        userData && createNotification(
          userData.id,
          'Akun Dibuat',
          `Akun Anda telah dibuat dengan username: ${userData.username} dan password default: bani1234. Silakan ganti password Anda setelah login.`
        )
      ]);
  
      // Clear cache
      await clearCache('persons*');
      await clearCache(`tree*`);
  
      // Send response
      res.status(201).json({
        status: 'success',
        data: { 
          person,
          newUser: userData ? {
            username: userData.username,
            defaultPassword: 'bani1234',
            role: userData.role
          } : null
        }
      });
  
    } catch (error) {
      logger.error('Create person error:', error);
      next(error);
    }
  },

  // Update person
  updatePerson: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      // Convert dates if present
      if (updateData.birthDate) {
        updateData.birthDate = new Date(updateData.birthDate);
      }
      if (updateData.deathDate) {
        updateData.deathDate = new Date(updateData.deathDate);
      }

      // Add updatedBy
      updateData.updatedBy = {
        connect: { id: req.user.id }
      };

      // Handle relationships
      if (updateData.parentId) {
        updateData.parent = {
          connect: { id: updateData.parentId }
        };
        delete updateData.parentId;
      }

      if (updateData.spouseId) {
        updateData.spouse = {
          connect: { id: updateData.spouseId }
        };
        delete updateData.spouseId;
      }

      if (updateData.baniId) {
        updateData.bani = {
          connect: { id: updateData.baniId }
        };
        delete updateData.baniId;
      }

      const person = await prisma.person.update({
        where: { id },
        data: updateData,
        include: {
          parent: true,
          spouse: true,
          children: true,
          previousMarriages: true,
          photos: true,
          bani: true,
          user: {
            select: {
              id: true,
              username: true,
              role: true
            }
          }
        }
      });

      // Clear cache setelah create
      await clearCache('persons*');
      await clearCache(`tree*`);

      res.json({
        status: 'success',
        data: { person }
      });
    } catch (error) {
      console.error('Update person error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengupdate data person'
      });
    }
  },

  // Soft delete person
  deletePerson: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.person.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: {
            connect: { id: req.user.id }
          }
        }
      });

      // Clear cache setelah create
      await clearCache('persons*');
      await clearCache(`tree*`);

      res.json({
        status: 'success',
        message: 'Person berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete person error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menghapus person'
      });
    }
  },

  // Get family tree
  getFamilyTree: async (req, res) => {
    try {
      const { id } = req.params;
      const { depth = 3 } = req.query;

      const getDescendants = async (personId, currentDepth = 0) => {
        if (currentDepth >= depth) return null;

        const person = await prisma.person.findUnique({
          where: { 
            id: personId,
            deletedAt: null 
          },
          select: {
            id: true,
            fullName: true,
            titlePrefix: true,
            titleSuffix: true,
            gender: true,
            birthDate: true,
            deathDate: true,
            status: true,
            address: true,
            phone: true,
            photos: {
              select: {
                url: true
            }
          },
            spouse: {
              select: {
                id: true,
                fullName: true,
                photos: {
                  select: {
                    url: true
                  }
              }
            }
            },
            children: {
              where: { deletedAt: null },
              select: {
                id: true,
                fullName: true,
                gender: true,
                birthDate: true,
                deathDate: true,
                status: true,
                photo: {
                  select: {
                    url: true
                  }
                }
              }
            }
          }
        });

        if (!person) return null;

        const descendants = await Promise.all(
          person.children.map(child => getDescendants(child.id, currentDepth + 1))
        );
  
        return {
          ...person,
          children: descendants.filter(Boolean)
        };
      };
  
      // Endpoint khusus untuk mendapatkan root
      if (id === 'root') {
        // Cari person yang tidak memiliki parent (root)
        const rootPerson = await prisma.person.findFirst({
          where: {
            parentId: null,
            deletedAt: null,
            baniId: req.user.person?.baniId // Filter berdasarkan bani user
          }
        });
  
        if (!rootPerson) {
          return res.json({
            status: 'success',
            data: {
              familyTree: null
            }
          });
        }
  
        const familyTree = await getDescendants(rootPerson.id);
  
        return res.json({
          status: 'success',
          data: {
            familyTree
          }
        });
      }
  
      // Untuk ID spesifik
      const familyTree = await getDescendants(id);
  
      if (!familyTree) {
        return res.status(404).json({
          status: 'error',
          message: 'Person tidak ditemukan'
        });
      }
  
      res.json({
        status: 'success',
        data: {
          familyTree
        }
      });
    } catch (error) {
      console.error('Get family tree error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data silsilah keluarga'
      });
    }
  }
};

module.exports = personController;
// end of backend/src/controllers/personController.js