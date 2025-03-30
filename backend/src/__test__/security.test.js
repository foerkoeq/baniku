// start of backend/src/__tests__/security.test.js
const request = require('supertest');
const app = require('../index');

describe('Security Headers', () => {
  it('should have security headers', async () => {
    const res = await request(app)
      .get('/');

    expect(res.headers).toHaveProperty('x-frame-options');
    expect(res.headers).toHaveProperty('x-xss-protection');
    expect(res.headers).toHaveProperty('x-content-type-options');
  });

  it('should block excessive requests', async () => {
    // Send more requests than the limit (5) to ensure rate limiting kicks in
    const requests = Array(10).fill().map(() => 
      request(app)
        .post('/api/auth/login')
        .send({ username: 'test', password: 'test' })
    );

    // Execute requests sequentially to ensure rate limiting works
    const responses = [];
    for (const req of requests) {
      responses.push(await req);
    }
    const lastResponse = responses[responses.length - 1];

    expect(lastResponse.statusCode).toBe(429); // too many requests
  });
});
// end of backend/src/__tests__/security.test.js