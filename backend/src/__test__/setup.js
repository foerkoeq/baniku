// start of backend/src/__tests__/setup.js
process.env.NODE_ENV = 'test';
require('dotenv').config({ path: '.env.test' });
jest.mock('nodemailer', () => require('./mocks/nodemailer.mock'));
const { PrismaClient } = require('@prisma/client');
const app = require('../index');
const prisma = new PrismaClient();

let server;

beforeAll(async () => {
  try {
    await prisma.$connect();
    console.log('Test database connected');
    server = app.listen();
  } catch (error) {
    console.error('Test database connection error:', error);
    throw error; // Gagalkan test jika tidak bisa connect
  }
});

afterEach(async () => {
  try {
    // Urutan truncate penting - hapus child tables dulu
    await prisma.$transaction([
      prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`,
      
      // Hapus data dari tabel yang memiliki foreign key dulu
      prisma.$executeRaw`TRUNCATE TABLE Notification;`,
      prisma.$executeRaw`TRUNCATE TABLE Photo;`,
      prisma.$executeRaw`TRUNCATE TABLE PreviousMarriage;`,
      prisma.$executeRaw`TRUNCATE TABLE Event;`,
      
      // Kemudian tabel utama
      prisma.$executeRaw`TRUNCATE TABLE Person;`,
      prisma.$executeRaw`TRUNCATE TABLE User;`,
      prisma.$executeRaw`TRUNCATE TABLE Bani;`,
      prisma.$executeRaw`TRUNCATE TABLE Province;`,
      prisma.$executeRaw`TRUNCATE TABLE City;`,
      
      prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`
    ]);
  } catch (error) {
    console.error('Error clearing test database:', error);
    throw error; // Gagalkan test jika clear database error
  }
});

afterAll(async () => {
  try {
    await prisma.$disconnect();
    await server.close();
    console.log('Test database disconnected');
  } catch (error) {
    console.error('Error disconnecting from test database:', error);
    throw error;
  }
});
// end of backend/src/__test__/setup.js