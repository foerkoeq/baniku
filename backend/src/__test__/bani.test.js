// start of backend/src/__tests__/bani.test.js
const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const app = require('../index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Bani Endpoints', () => {
  let testUser;
  let authToken;
  let testBani;
  

  beforeEach(async () => {
    // Setup authenticated user
    testUser = await prisma.user.create({
      data: {
        username: 'adminuser',
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'SUPER_ADMIN',
        isActive: true
      }
    });

    // Generate valid token
    authToken = jwt.sign({ userId: testUser.id }, process.env.JWT_SECRET);

    // Create test bani
    testBani = await prisma.bani.create({
      data: {
        name: 'Test Bani',
        description: 'Test Description'
      }
    });
  });

  describe('GET /api/banis', () => {
    it('should get all banis', async () => {
      const res = await request(app)
        .get('/api/banis')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data.banis)).toBeTruthy();
    });
  });

  describe('GET /api/banis/:id', () => {
    it('should get specific bani', async () => {
      const res = await request(app)
        .get(`/api/banis/${testBani.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.bani.name).toBe('Test Bani');
    });

    it('should return 404 for non-existent bani', async () => {
      const res = await request(app)
        .get('/api/banis/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/banis', () => {
    it('should create new bani', async () => {
      const res = await request(app)
        .post('/api/banis')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'New Bani',
          description: 'New Description'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.bani.name).toBe('New Bani');
    });
  });

  describe('PUT /api/banis/:id', () => {
    it('should update bani', async () => {
      const res = await request(app)
        .put(`/api/banis/${testBani.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Bani',
          description: 'Updated Description'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.bani.name).toBe('Updated Bani');
    });
  });
});
// end of backend/src/__tests__/bani.test.js