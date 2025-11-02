const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');

const app = express();
app.use('/', routes);

describe('GET /health', () => {
  it('should return ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
