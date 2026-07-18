const request = require('supertest');
const app = require('../src/index');

describe('Health', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Login', () => {
  it('POST /api/login success returns token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'Iwillwin@7a' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe('admin');
  });

  it('POST /api/login wrong password returns 401', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('POST /api/login missing body returns 400', async () => {
    const res = await request(app).post('/api/login').send({});
    expect(res.status).toBe(400);
  });
});

describe('Protected Routes', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'Iwillwin@7a' });
    token = res.body.token;
  });

  it('GET /api/verify with valid token returns valid:true', async () => {
    const res = await request(app)
      .get('/api/verify')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
  });

  it('GET /api/verify without token returns 401', async () => {
    const res = await request(app).get('/api/verify');
    expect(res.status).toBe(401);
  });

  it('GET /api/me returns user info', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('admin');
  });
});
