const service = require('../services/orderService');
const { Order, OrderItem, Product } = require('../models');

async function confirmPayment(req, res, next) {
  try {
    const { id } = req.params;
    // Buscar por id ou hash_code
    const order = await Order.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { id: isNaN(id) ? null : Number(id) },
          { hash_code: id }
        ],
        user_id: req.user.id
      }
    });
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    const out = await service.confirmPayment(req.user.id, order.id);
    res.json({
      order_id: out.order.id,
      hash_code: out.order.hash_code,
      status: out.order.status,
      paid_at: out.order.paid_at,
      points_awarded: out.points_awarded
    });
  } catch (err) { next(err); }
}

async function status(req, res, next) {
  try {
    const { id } = req.params;
    const s = await service.getOrderStatus(req.user.id, id); // Aceita id ou hash_code
    res.json(s);
  } catch (err) { next(err); }
}

// opcional: avançar status
async function advance(req, res, next) {
  try {
    const { id } = req.params;
    const { next_status } = req.body; // 'ready', 'delivered' ou 'canceled'
    // Buscar por id ou hash_code
    const order = await Order.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { id: isNaN(id) ? null : Number(id) },
          { hash_code: id }
        ],
        user_id: req.user.id
      }
    });
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    const s = await service.advanceStatus(req.user.id, order.id, next_status);
    res.json(s);
  } catch (err) { next(err); }
}

async function history(req, res, next) {
  try {
    const { Review } = require('../models');
    const orders = await Order.findAll({
      where: { 
        user_id: req.user.id,
        status: { [require('sequelize').Op.ne]: 'created' } // Não exibir pedidos com status 'created'
      },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, attributes: ['id','name','price_cents'] }]
        },
        {
          model: Review,
          as: 'review',
          required: false // LEFT JOIN para incluir avaliação se existir
        }
      ]
    });
    res.json(orders);
  } catch (err) { next(err); }
}

module.exports = { confirmPayment, status, advance, history };
