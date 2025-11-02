'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.TEXT, allowNull: false },
      description: { type: Sequelize.TEXT },
      price_cents: { type: Sequelize.INTEGER, allowNull: false },
      is_ready_now: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_cupcake_of_month: { type: Sequelize.BOOLEAN, defaultValue: false },
      month_discount_percent: { type: Sequelize.INTEGER, defaultValue: 0 },
      image_url: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('products'); }
};
