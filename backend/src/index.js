// start of backend/src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const { globalLimiter, authLimiter, apiLimiter } = require('./config/rateLimiter');
const logger = require('./utils/logger');
const securityConfig = require('./config/security');
const sanitizer = require('./middlewares/sanitizer');
const AppError = require('./utils/errors/AppError');

const authRoutes = require('./routes/authRoutes');
const personRoutes = require('./routes/personRoutes');
const baniRoutes = require('./routes/baniRoutes');
const photoRoutes = require('./routes/photoRoutes');
const eventRoutes = require('./routes/eventRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const locationRoutes = require('./routes/locationRoutes');
const errorHandler = require('./utils/errors/errorHandler');

const app = express();
const prisma = new PrismaClient();

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // 10 menit
};

/// Error handlers untuk unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {promise, reason});
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

// Middleware - urutannya penting
app.use(cors(corsOptions)); // Gunakan corsOptions yang sudah didefinisikan
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Logging middleware
app.use((req, res, next) => {
  logger.info('Incoming Request', {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip
  });
  next();
});

// Security middleware
app.use(securityConfig);
app.use(sanitizer);

// Rate limiters
app.use(globalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/banis', baniRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/locations', locationRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});


// Handler untuk unhandled routes - gunakan satu saja
app.all('*', (req, res, next) => {
  next(new AppError(`Tidak dapat menemukan ${req.originalUrl} pada server ini!`, 404));
});


// Global Error Handler
app.use(errorHandler);

// Hanya jalankan server jika bukan testing environment
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await prisma.$connect();
      logger.info('Database terhubung');
      
      app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
        logger.info(`Server berjalan di port ${process.env.PORT || 5000}`);
      });
    } catch (error) {
      logger.error('Gagal menjalankan server:', error);
      process.exit(1);
    }
  };

  startServer();
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM diterima. Melakukan cleanup...');
  await prisma.$disconnect();
  process.exit(0);
});

// Export app untuk testing
module.exports = app;
// end of backend/src/index.js