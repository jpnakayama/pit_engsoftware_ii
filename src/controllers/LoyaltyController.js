// src/controllers/LoyaltyController.js
const service = require('../services/loyaltyService');

async function summary(req, res, next) {
  try {
    const limit = Math.max(parseInt(req.query.limit || '20', 10), 1);
    const offset = Math.max(parseInt(req.query.offset || '0', 10), 0);
    const out = await service.getSummary(req.user.id, limit, offset);
    res.json(out);
  } catch (err) { next(err); }
}

module.exports = { summary };
