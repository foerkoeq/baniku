// start of backend/src/__tests__/person.test.js
const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const app = require('../index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Person Endpoints', () => {
  let testUser = null;
  let authToken = null;
  let testBani = null;
  let testPerson = null;

  beforeEach(async () => {
    // Setup authenticated user (SUPER_ADMIN)
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
    authToken = jwt.sign(
      { userId: testUser.id }, 
      process.env.JWT_SECRET || 'test-secret-key'
    );

    // Buat test bani
    testBani = await prisma.bani.create({
      data: {
        name: 'Test Bani',
        description: 'Test Description'
      }
    });

    // Buat test person dengan data lengkap sesuai schema
    testPerson = await prisma.person.create({
      data: {
        fullName: 'Test Person',
        gender: 'MALE',
        status: 'ALIVE',
        maritalStatus: 'SINGLE',
        baniId: testBani.id,
        createdById: testUser.id,
        updatedById: testUser.id
      }
    });
  });

  // Bersihkan data test setelah setiap test

  describe('GET /api/persons', () => {
    it('should get all persons as SUPER_ADMIN', async () => {
      const res = await request(app)
        .get('/api/persons')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data.persons)).toBeTruthy();
    });

    // Test untuk role lain
    it('should get filtered persons as ADMIN_BANI', async () => {
      // Buat user ADMIN_BANI dan test
    });
  });

  describe('GET /api/persons/:id', () => {
    it('should get specific person', async () => {
      const res = await request(app)
        .get(`/api/persons/${testPerson.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.person.fullName).toBe('Test Person');
    });

    it('should return 404 for non-existent person', async () => {
      const res = await request(app)
        .get('/api/persons/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/persons', () => {
    it('should create new person with complete data', async () => {
      const newPersonData = {
        fullName: 'New Person',
        gender: 'MALE',
        status: 'ALIVE',
        maritalStatus: 'SINGLE',
        baniId: testBani.id
      };

      const res = await request(app)
        .post('/api/persons')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newPersonData);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.person.fullName).toBe('New Person');
    });

    it('should fail without required fields', async () => {
      const res = await request(app)
        .post('/api/persons')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fullName: 'New Person'
          // Missing required fields
        });

      expect(res.statusCode).toBe(400);
    });
  });

  // Tambahkan test untuk PUT dan DELETE
  describe('PUT /api/persons/:id', () => {
    it('should update person data', async () => {
      // Test update
    });
  });

  describe('DELETE /api/persons/:id', () => {
    it('should delete person as SUPER_ADMIN', async () => {
      // Test delete
    });
  });
});
// end of backend/src/__tests__/person.test.js