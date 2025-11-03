// tests/integration/cart_checkout.test.js
const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');
const { sequelize, User, Product, Order, OrderItem } = require('../../src/models');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/', routes);

describe('Cart + Checkout PIX flow', () => {
  let user, token, product;

  beforeAll(async () => {
    await sequelize.sync(); // sqlite in-memory
    user = await User.create({ name: 'CartUser', email: 'cart@example.com', password_hash: 'hash' });
    token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET || 'dev-secret');
    product = await Product.create({ name: 'Cupcake Chocolate', price_cents: 1500, description: 'bom', is_cupcake_of_month: true });
  });

  afterAll(async () => { await sequelize.close(); });

  it('should add item to cart and checkout pix', async () => {
    const add = await request(app)
      .post('/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ product_id: product.id, quantity: 2 });
    expect(add.status).toBe(201);
    expect(add.body.cart.subtotal).toBe(3000);

    const co = await request(app)
      .post('/checkout/pix')
      .set('Authorization', `Bearer ${token}`)
      .send({ delivery_type: 'retirada' });
    expect(co.status).toBe(201);
    expect(co.body).toHaveProperty('order_id');
    expect(co.body.status).toBe('awaiting_payment');
    expect(co.body.subtotal_cents).toBe(3000);
    expect(co.body.bonus_cents).toBe(200);
    expect(co.body.total_cents).toBe(2800);
    expect(typeof co.body.qrCode).toBe('string');
  });
});
