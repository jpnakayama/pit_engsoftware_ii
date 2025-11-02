const service = require('../services/orderService');
const { Order, OrderItem, Product } = require('../models');

async function confirmPayment(req, res, next) {
  try {
    const { id } = req.params;
    const out = await service.confirmPayment(req.user.id, Number(id));
    res.json({
      order_id: out.order.id,
      status: out.order.status,
      paid_at: out.order.paid_at,
      points_awarded: out.points_awarded
    });
  } catch (err) { next(err); }
}

async function status(req, res, next) {
  try {
    const { id } = req.params;
    const s = await service.getOrderStatus(req.user.id, Number(id));
    res.json(s);
  } catch (err) { next(err); }
}

// opcional: avançar status
async function advance(req, res, next) {
  try {
    const { id } = req.params;
    const { next_status } = req.body; // 'ready', 'delivered' ou 'canceled'
    const s = await service.advanceStatus(req.user.id, Number(id), next_status);
    res.json(s);
  } catch (err) { next(err); }
}

async function history(req, res, next) {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, attributes: ['id','name','price_cents'] }]
      }]
    });
    res.json(orders);
  } catch (err) { next(err); }
}

module.exports = { confirmPayment, status, advance, history };
