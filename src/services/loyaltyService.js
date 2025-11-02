// src/services/loyaltyService.js
const { LoyaltyLedger } = require('../models');
const { fn, col, literal } = require('sequelize');

async function getSummary(userId, limit = 20, offset = 0) {
  const [rows, countRow] = await Promise.all([
    LoyaltyLedger.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit,
      offset,
      attributes: ['id', 'points_delta', 'reason', 'created_at']
    }),
    LoyaltyLedger.findAll({
      where: { user_id: userId },
      attributes: [[fn('COALESCE', fn('SUM', col('points_delta')), literal('0')), 'sum']],
      raw: true
    })
  ]);

  const total_points = parseInt((countRow[0] && countRow[0].sum) || 0, 10);
  return { total_points, entries: rows };
}

module.exports = { getSummary };
