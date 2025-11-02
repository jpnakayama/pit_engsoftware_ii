const service = require('../services/orderService');

async function pix(req, res, next) {
  try {
    const { delivery_type } = req.body; // 'retirada' | 'delivery'
    const out = await service.checkoutPix(req.user.id, { delivery_type });
    res.status(201).json({
      order_id: out.order.id,
      status: out.order.status,
      delivery_type: out.order.delivery_type,
      bonus_cents: out.bonus,
      subtotal_cents: out.subtotal,
      total_cents: out.total,
      qrCode: out.qrCode
    });
  } catch (err) { next(err); }
}

module.exports = { pix };
