// start of backend/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Health check untuk docker
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ 
      status: 'success',
      message: 'Database connected successfully!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database terhubung');
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server berjalan di port ${port}`);
    });
  } catch (error) {
    console.error('Gagal menjalankan server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM diterima. Melakukan cleanup...');
  await prisma.$disconnect();
  process.exit(0);
});
// end of backend/index.js