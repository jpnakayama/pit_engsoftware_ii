const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const LoyaltyLedger = sequelize.define('LoyaltyLedger', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    points_delta: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.TEXT }
  }, { tableName: 'loyalty_ledger' });

  LoyaltyLedger.associate = (db) => {
    LoyaltyLedger.belongsTo(db.User, { foreignKey: 'user_id' });
  };

  return LoyaltyLedger;
};
