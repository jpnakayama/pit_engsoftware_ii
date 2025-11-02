const { Order, OrderItem, Product, LoyaltyLedger, Sequelize } = require('../models');
const { Op } = Sequelize;

async function getOrCreateCart(userId) {
  let order = await Order.findOne({ where: { user_id: userId, status: 'created' } });
  if (!order) order = await Order.create({ user_id: userId, status: 'created' });
  return order;
}

async function addItemToCart(userId, { product_id, quantity, note }) {
  if (!product_id || !quantity || quantity < 1) {
    const e = new Error('Produto/quantidade inválidos'); e.status = 400; throw e;
  }

  const product = await Product.findByPk(product_id);
  if (!product) { const e = new Error('Produto não encontrado'); e.status = 404; throw e; }

  const order = await getOrCreateCart(userId);

  const item = await OrderItem.create({
    order_id: order.id,
    product_id,
    quantity,
    unit_price_cents: product.price_cents,
    note: note || null
  });

  return item;
}

async function removeItemFromCart(userId, orderItemId) {
  const order = await getOrCreateCart(userId);
  const item = await OrderItem.findOne({ where: { id: orderItemId, order_id: order.id } });
  if (!item) { const e = new Error('Item não encontrado no carrinho'); e.status = 404; throw e; }
  await item.destroy();
  return true;
}

async function getCart(userId) {
  const order = await getOrCreateCart(userId);
  const items = await OrderItem.findAll({
    where: { order_id: order.id },
    include: [{ model: Product, attributes: ['id','name','price_cents','is_cupcake_of_month'] }]
  });

  const subtotal = items.reduce((acc, it) => acc + it.quantity * it.unit_price_cents, 0);
  return { order, items, subtotal };
}

function calcBonus(delivery_type) {
  return delivery_type === 'retirada' ? 200 : 0; // R$2,00
}

async function checkoutPix(userId, { delivery_type }) {
  if (!['retirada','delivery'].includes(delivery_type || '')) {
    const e = new Error('delivery_type inválido (retirada|delivery)'); e.status = 400; throw e;
  }

  const { order, items, subtotal } = await getCart(userId);

  if (items.length === 0) { const e = new Error('Carrinho vazio'); e.status = 400; throw e; }

  const bonus = calcBonus(delivery_type);
  const total = Math.max(subtotal - bonus, 0);

  order.delivery_type = delivery_type;
  order.bonus_cents = bonus;
  order.total_cents = total;
  order.status = 'awaiting_payment';
  await order.save();

  const qrCode = `PIX:ORDER:${order.id}:TOTAL:${total}`; // placeholder

  return { order, subtotal, total, bonus, qrCode };
}

function calculateLoyaltyPoints(total_cents) {
  // 1 ponto a cada R$10 => 1000 centavos
  return Math.floor((total_cents || 0) / 1000);
}

async function confirmPayment(userId, orderId) {
  const order = await Order.findOne({ where: { id: orderId, user_id: userId } });
  if (!order) { const e = new Error('Pedido não encontrado'); e.status = 404; throw e; }
  if (order.status !== 'awaiting_payment') { const e = new Error('Pedido não está aguardando pagamento'); e.status = 400; throw e; }

  order.status = 'preparing';
  order.paid_at = new Date();
  await order.save();

  // Lançar pontos de fidelidade
  const points = calculateLoyaltyPoints(order.total_cents);
  if (points > 0) {
    await LoyaltyLedger.create({
      user_id: userId,
      points_delta: points,
      reason: `Pedido #${order.id} pago`
    });
  }

  return { order, points_awarded: points };
}

async function getOrderStatus(userId, orderId) {
  const order = await Order.findOne({ where: { id: orderId, user_id: userId } });
  if (!order) { const e = new Error('Pedido não encontrado'); e.status = 404; throw e; }
  return { id: order.id, status: order.status, paid_at: order.paid_at, total_cents: order.total_cents };
}

// (opcional) avançar status manualmente
async function advanceStatus(userId, orderId, nextStatus) {
  const allowed = ['preparing','ready','delivered','canceled'];
  if (!allowed.includes(nextStatus)) {
    const e = new Error('Status inválido'); e.status = 400; throw e;
  }
  const order = await Order.findOne({ where: { id: orderId, user_id: userId } });
  if (!order) { const e = new Error('Pedido não encontrado'); e.status = 404; throw e; }

  // Regras simples de transição
  const flow = {
    awaiting_payment: ['preparing'],
    preparing: ['ready','canceled'],
    ready: ['delivered','canceled'],
    delivered: [],
    canceled: []
  };
  const canGo = flow[order.status] || [];
  if (!canGo.includes(nextStatus)) {
    const e = new Error(`Transição inválida: ${order.status} → ${nextStatus}`); e.status = 400; throw e;
  }

  order.status = nextStatus;
  await order.save();
  return { id: order.id, status: order.status };
}

module.exports = {
  // já exportados antes:
  getOrCreateCart, addItemToCart, removeItemFromCart, getCart, checkoutPix,
  // novos:
  confirmPayment, getOrderStatus, advanceStatus
};
