// start of backend/src/controllers/eventController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createNotification } = require('./notificationController');

const eventController = {
  // Get all events dengan filter dan pagination
  getAllEvents: async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search,
        baniId,
        startDate,
        endDate 
      } = req.query;

      const skip = (page - 1) * Number(limit);
      
      // Build where clause
      const where = {
        AND: []
      };

      if (search) {
        where.AND.push({
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
            { location: { contains: search } }
          ]
        });
      }

      if (baniId) {
        where.baniId = baniId;
      }

      if (startDate) {
        where.AND.push({
          startDate: {
            gte: new Date(startDate)
          }
        });
      }

      if (endDate) {
        where.AND.push({
          endDate: {
            lte: new Date(endDate)
          }
        });
      }

      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            bani: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            startDate: 'desc'
          }
        }),
        prisma.event.count({ where })
      ]);

      res.json({
        status: 'success',
        data: {
          events,
          pagination: {
            total,
            pages: Math.ceil(total / Number(limit)),
            page: Number(page),
            limit: Number(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get events error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data event'
      });
    }
  },

  // Get event by ID
  getEventById: async (req, res) => {
    try {
      const { id } = req.params;

      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          bani: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      if (!event) {
        return res.status(404).json({
          status: 'error',
          message: 'Event tidak ditemukan'
        });
      }

      res.json({
        status: 'success',
        data: { event }
      });
    } catch (error) {
      console.error('Get event error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data event'
      });
    }
  },

  // Create new event
  createEvent: async (req, res) => {
    try {
      const { 
        title,
        description,
        startDate,
        endDate,
        location,
        baniId 
      } = req.body;

      const event = await prisma.event.create({
        data: {
          title,
          description,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          location,
          bani: {
            connect: { id: baniId }
          }
        },
        include: {
          bani: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      const usersInBani = await prisma.user.findMany({
        where: {
          person: {
            baniId: baniId
          }
        }
      });
      
      await Promise.all(
        usersInBani.map(user =>
          createNotification(
            user.id,
            'Event Baru',
            `Event baru telah dibuat: ${title}`
          )
        )
      );

      await clearCache('events*');

      res.status(201).json({
        status: 'success',
        data: { event }
      });
    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat membuat event'
      });
    }
  },

  // Update event
  updateEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Convert dates if present
      if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate);
      }

      const event = await prisma.event.update({
        where: { id },
        data: updateData,
        include: {
          bani: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      await clearCache('events*');

      res.json({
        status: 'success',
        data: { event }
      });
    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengupdate event'
      });
    }
  },

  // Delete event
  deleteEvent: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.event.delete({
        where: { id }
      });

      await clearCache('events*');

      res.json({
        status: 'success',
        message: 'Event berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menghapus event'
      });
    }
  }
};

module.exports = eventController;
// end of backend/src/controllers/eventController.js