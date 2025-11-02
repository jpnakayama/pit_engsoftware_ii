const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.TEXT,
      defaultValue: 'created'
    },
    delivery_type: { type: DataTypes.TEXT },
    bonus_cents: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_cents: { type: DataTypes.INTEGER }
  }, { tableName: 'orders' });

  Order.associate = (db) => {
    Order.belongsTo(db.User, { foreignKey: 'user_id' });
    Order.hasMany(db.OrderItem, { foreignKey: 'order_id', as: 'items' });
  };

  return Order;
};
