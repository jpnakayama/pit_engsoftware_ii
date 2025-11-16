const service = require('../services/orderService');

async function addItem(req, res, next) {
  try {
    const item = await service.addItemToCart(req.user.id, req.body);
    const cart = await service.getCart(req.user.id);
    res.status(201).json({ added: item, cart });
  } catch (err) { next(err); }
}

async function list(req, res, next) {
  try {
    const cart = await service.getCart(req.user.id);
    res.json(cart);
  } catch (err) { next(err); }
}

async function removeItem(req, res, next) {
  try {
    await service.removeItemFromCart(req.user.id, Number(req.params.id));
    const cart = await service.getCart(req.user.id);
    res.json({ ok: true, cart });
  } catch (err) { next(err); }
}

async function updateItem(req, res, next) {
  try {
    const { quantity } = req.body;
    const item = await service.updateItemQuantity(req.user.id, Number(req.params.id), quantity);
    const cart = await service.getCart(req.user.id);
    res.json({ ok: true, item, cart });
  } catch (err) { next(err); }
}

async function decreaseItem(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const result = await service.decreaseItemQuantity(req.user.id, productId);
    const cart = await service.getCart(req.user.id);
    res.json({ ok: true, ...result, cart });
  } catch (err) { next(err); }
}

module.exports = { addItem, list, removeItem, updateItem, decreaseItem };
