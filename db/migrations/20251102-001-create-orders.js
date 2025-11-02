'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'created'
      },
      delivery_type: { type: Sequelize.TEXT, allowNull: true },
      bonus_cents: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      total_cents: { type: Sequelize.INTEGER, allowNull: true }, // calculado no checkout
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('orders');
  }
};
