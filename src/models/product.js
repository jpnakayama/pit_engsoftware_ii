const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT },
    details: { type: DataTypes.TEXT },
    price_cents: { type: DataTypes.INTEGER, allowNull: false },
    is_ready_now: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_cupcake_of_month: { type: DataTypes.BOOLEAN, defaultValue: false },
    month_discount_percent: { type: DataTypes.INTEGER, defaultValue: 0 },
    image_url: { type: DataTypes.TEXT }
  }, { tableName: 'products' });
  return Product;
};
