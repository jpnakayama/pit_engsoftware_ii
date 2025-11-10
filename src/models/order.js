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
    payment_method: { type: DataTypes.TEXT },
    hash_code: { type: DataTypes.TEXT, unique: true },
    bonus_cents: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_cents: { type: DataTypes.INTEGER }
  }, { tableName: 'orders' });

  Order.associate = (db) => {
    Order.belongsTo(db.User, { foreignKey: 'user_id' });
    Order.hasMany(db.OrderItem, { foreignKey: 'order_id', as: 'items' });
    Order.hasOne(db.Review, { foreignKey: 'order_id', as: 'review' });
  };

  return Order;
};
