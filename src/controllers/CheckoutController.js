const service = require('../services/orderService');

async function pix(req, res, next) {
  try {
    const { delivery_type, payment_method } = req.body; // 'retirada' | 'delivery', 'pix'
    const out = await service.checkoutPix(req.user.id, { delivery_type, payment_method });
    res.status(201).json({
      order_id: out.order.id,
      hash_code: out.order.hash_code,
      status: out.order.status,
      delivery_type: out.order.delivery_type,
      payment_method: out.order.payment_method,
      bonus_cents: out.bonus,
      subtotal_cents: out.subtotal,
      total_cents: out.total,
      qrCode: out.qrCode
    });
  } catch (err) { next(err); }
}

module.exports = { pix };
