// start of backend/src/__tests__/error.test.js
const request = require('supertest');
const app = require('../index');

describe('Error Handler', () => {
  it('should handle 404 routes', async () => {
    const res = await request(app)
      .get('/api/tidak-ada');

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  it('should handle validation errors', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        // kirim data kosong untuk trigger validasi
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
    expect(res.body).toHaveProperty('data'); // validation errors
  });
});
// end of backend/src/__tests__/error.test.js