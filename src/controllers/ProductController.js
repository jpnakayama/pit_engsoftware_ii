// src/controllers/ProductController.js
const { Product } = require('../models');

/**
 * GET /products
 * Query params:
 *  - page (default 1)
 *  - limit (default 10)
 *  - only_month (boolean: filtra Cupcake do Mês)
 */
async function list(req, res, next) {
  try {
    const page  = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(parseInt(req.query.limit || '10', 10), 1);
    const offset = (page - 1) * limit;

    const where = {};
    if (String(req.query.only_month || '').toLowerCase() === 'true') {
      where.is_cupcake_of_month = true;
    }

    const { rows, count } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']]
    });

    return res.json({
      page,
      limit,
      total: count,
      items: rows
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { list };
