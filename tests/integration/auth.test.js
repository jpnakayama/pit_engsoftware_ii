// tests/integration/auth.test.js
const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');
const { sequelize, User } = require('../../src/models');

const app = express();
app.use(express.json());
app.use('/', routes);

describe('Auth flow', () => {
  beforeAll(async () => {
    await sequelize.sync(); // para ambiente de teste sqlite in-memory
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should signup and return token', async () => {
    const res = await request(app).post('/auth/signup').send({
      name: 'Tester',
      email: 'tester@example.com',
      password: 'password123'
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('tester@example.com');
  });

  it('should not signup with duplicate email', async () => {
    const res = await request(app).post('/auth/signup').send({
      name: 'Tester 2',
      email: 'tester@example.com',
      password: 'password123'
    });
    expect(res.status).toBe(409);
  });

  it('should login and access protected route /me', async () => {
    const login = await request(app).post('/auth/login').send({
      email: 'tester@example.com',
      password: 'password123'
    });
    expect(login.status).toBe(200);
    const token = login.body.token;

    const me = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe('tester@example.com');
  });
});
