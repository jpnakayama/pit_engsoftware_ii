// tests/integration/order_flow.test.js
const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');
const { sequelize, User, Product, LoyaltyLedger, Review } = require('../../src/models');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/', routes);

describe('Order full flow (checkout → pay → advance → review)', () => {
  let user, token, product, orderId;

  beforeAll(async () => {
    await sequelize.sync();
    user = await User.create({ name: 'FlowUser', email: 'flow@example.com', password_hash: 'hash' });
    token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET || 'dev-secret');
    product = await Product.create({ name: 'Cupcake Morango', price_cents: 1200 });
  });

  afterAll(async () => { await sequelize.close(); });

  it('should run the whole flow', async () => {
    // add to cart
    const add = await request(app)
      .post('/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ product_id: product.id, quantity: 3 });
    expect(add.status).toBe(201);

    // checkout (delivery)
    const co = await request(app)
      .post('/checkout/pix')
      .set('Authorization', `Bearer ${token}`)
      .send({ delivery_type: 'delivery' });
    expect(co.status).toBe(201);
    orderId = co.body.order_id;
    expect(co.body.subtotal_cents).toBe(3600);
    expect(co.body.bonus_cents).toBe(0);
    expect(co.body.total_cents).toBe(3600);

    // status awaiting_payment
    let st = await request(app)
      .get(`/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${token}`);
    expect(st.status).toBe(200);
    expect(st.body.status).toBe('awaiting_payment');

    // pay → preparing, points awarded
    const pay = await request(app)
      .post(`/orders/${orderId}/pay`)
      .set('Authorization', `Bearer ${token}`);
    expect(pay.status).toBe(200);
    expect(pay.body.status).toBe('preparing');
    // pontos: floor(3600/1000) = 3
    const entries = await LoyaltyLedger.findAll({ where: { user_id: user.id } });
    const totalPoints = entries.reduce((s, e) => s + e.points_delta, 0);
    expect(totalPoints).toBeGreaterThanOrEqual(3);

    // advance to ready
    const adv1 = await request(app)
      .post(`/orders/${orderId}/advance`)
      .set('Authorization', `Bearer ${token}`)
      .send({ next_status: 'ready' });
    expect(adv1.status).toBe(200);

    // review allowed (ready)
    const rev = await request(app)
      .post(`/orders/${orderId}/review`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5, comment: 'Perfeito!' });
    expect(rev.status).toBe(201);

    // second review must fail (409)
    const rev2 = await request(app)
      .post(`/orders/${orderId}/review`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 4, comment: 'dup' });
    expect(rev2.status).toBe(409);
    const countReviews = await Review.count({ where: { order_id: orderId } });
    expect(countReviews).toBe(1);

    // advance to delivered (ok)
    const adv2 = await request(app)
      .post(`/orders/${orderId}/advance`)
      .set('Authorization', `Bearer ${token}`)
      .send({ next_status: 'delivered' });
    expect(adv2.status).toBe(200);

    // status final
    st = await request(app)
      .get(`/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${token}`);
    expect(st.status).toBe(200);
    expect(st.body.status).toBe('delivered');
  });
});
