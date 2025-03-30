// start of backend/src/__tests__/auth.test.js
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

jest.mock('nodemailer', () => require('./mocks/nodemailer.mock'));

describe('Auth Endpoints', () => {
  let testUser;
  let timestamp;

  beforeEach(async () => {
    // Setup test user
    timestamp = new Date().getTime();
  const hashedPassword = await bcrypt.hash('password123', 10);
  testUser = await prisma.user.create({
    data: {
      username: `testuser_${timestamp}`,
      email: `test_${timestamp}@example.com`,
      password: hashedPassword,
      role: 'MEMBER',
      isActive: true
    }
  });
});

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: `testuser_${timestamp}`,
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('username', `testuser_${timestamp}`);
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('error');
    });

    it('should fail with non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should send reset password email for existing user', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: `test_${timestamp}@example.com`
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('should fail for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });
});
// end of backend/src/__tests__/auth.test.js