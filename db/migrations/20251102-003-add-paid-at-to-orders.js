'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'paid_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'paid_at');
  }
};
