// tests/integration/loyalty.test.js
const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');
const { sequelize, User, LoyaltyLedger } = require('../../src/models');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/', routes);

describe('Loyalty summary', () => {
  let user, token;

  beforeAll(async () => {
    await sequelize.sync(); // usa sqlite in-memory no ambiente de teste
    user = await User.create({ name: 'Loy', email: 'loy@example.com', password_hash: 'hash' });
    token = jwt.sign({ id: user.id, name: user.name, email: user.email }, 'dev-secret'); // no teste, segredo dev
    await LoyaltyLedger.bulkCreate([
      { user_id: user.id, points_delta: 3, reason: 'Pedido #1' },
      { user_id: user.id, points_delta: 2, reason: 'Pedido #2' }
    ]);
  });

  afterAll(async () => { await sequelize.close(); });

  it('should return total points and entries', async () => {
    const res = await request(app)
      .get('/loyalty/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.total_points).toBeGreaterThanOrEqual(5);
    expect(Array.isArray(res.body.entries)).toBe(true);
  });
});
