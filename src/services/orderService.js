const { Order, OrderItem, Product, Sequelize } = require('../models');
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

module.exports = {
  getOrCreateCart,
  addItemToCart,
  removeItemFromCart,
  getCart,
  checkoutPix
};
