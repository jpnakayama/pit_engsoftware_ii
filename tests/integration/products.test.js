// tests/integration/products.test.js
process.env.NODE_ENV = 'test';

const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');
const { sequelize, Product } = require('../../src/models');

const app = express();
app.use(express.json());
app.use('/', routes);

describe('GET /products', () => {
  // Sincroniza o banco antes de todos os testes
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Adiciona dados de teste
    await Product.bulkCreate([
      {
        name: 'Cupcake Chocolate',
        description: 'Massa de cacau, cobertura de brigadeiro',
        price_cents: 900,
        is_cupcake_of_month: false
      },
      {
        name: 'Cupcake Baunilha',
        description: 'Clássico, cobertura de creme',
        price_cents: 850,
        is_cupcake_of_month: false
      },
      {
        name: 'Cupcake do Mês',
        description: 'Sabor especial da casa',
        price_cents: 1000,
        is_cupcake_of_month: true,
        month_discount_percent: 20
      }
    ]);
  });

  // Limpa o banco após todos os testes
  afterAll(async () => {
    await sequelize.close();
  });

  it('should list products with pagination', async () => {
    const res = await request(app).get('/products?limit=2&page=1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('limit', 2);
    expect(res.body).toHaveProperty('total');
  });

  it('should filter cupcake of the month when only_month=true', async () => {
    const res = await request(app).get('/products?only_month=true');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    if (res.body.items.length > 0) {
      for (const p of res.body.items) {
        expect(p.is_cupcake_of_month).toBe(true);
      }
    }
  });
});
