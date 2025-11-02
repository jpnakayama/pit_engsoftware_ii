const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT }
  }, { tableName: 'reviews' });

  Review.associate = (db) => {
    Review.belongsTo(db.Order, { foreignKey: 'order_id' });
  };

  return Review;
};
