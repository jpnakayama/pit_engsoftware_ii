const { Order, Review } = require('../models');

async function create(req, res, next) {
  try {
    const { id } = req.params; // order id
    const { rating, comment } = req.body;

    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return res.status(400).json({ message: 'rating deve estar entre 1 e 5' });
    }

    const order = await Order.findOne({ where: { id: id, user_id: req.user.id } });
    if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });

    // Regra: só permite avaliar pedido pronto/entregue
    if (!['ready','delivered'].includes(order.status)) {
      return res.status(400).json({ message: `Pedido com status '${order.status}' não pode ser avaliado` });
    }

    // 1 review por pedido
    const exists = await Review.findOne({ where: { order_id: order.id } });
    if (exists) return res.status(409).json({ message: 'Pedido já avaliado' });

    const rev = await Review.create({
      order_id: order.id,
      rating: r,
      comment: comment || null
    });

    return res.status(201).json({
      review_id: rev.id,
      order_id: order.id,
      rating: rev.rating,
      comment: rev.comment
    });
  } catch (err) { next(err); }
}

module.exports = { create };
