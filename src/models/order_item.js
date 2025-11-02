const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unit_price_cents: { type: DataTypes.INTEGER, allowNull: false },
    note: { type: DataTypes.TEXT }
  }, { tableName: 'order_items' });

  OrderItem.associate = (db) => {
    OrderItem.belongsTo(db.Order, { foreignKey: 'order_id' });
    OrderItem.belongsTo(db.Product, { foreignKey: 'product_id' });
  };

  return OrderItem;
};
