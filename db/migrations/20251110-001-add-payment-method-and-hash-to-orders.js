'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('orders');
    
    // Adicionar payment_method apenas se não existir
    if (!tableDescription.payment_method) {
      await queryInterface.addColumn('orders', 'payment_method', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
    
    // Adicionar hash_code apenas se não existir
    if (!tableDescription.hash_code) {
      await queryInterface.addColumn('orders', 'hash_code', {
        type: Sequelize.TEXT,
        allowNull: true
      });
      // Criar índice único separadamente (SQLite não suporta UNIQUE na criação de coluna)
      await queryInterface.addIndex('orders', ['hash_code'], {
        unique: true,
        name: 'orders_hash_code_unique'
      });
    }
  },
  async down(queryInterface) {
    const tableDescription = await queryInterface.describeTable('orders');
    
    if (tableDescription.payment_method) {
      await queryInterface.removeColumn('orders', 'payment_method');
    }
    
    if (tableDescription.hash_code) {
      // Remover índice único antes de remover a coluna
      try {
        await queryInterface.removeIndex('orders', 'orders_hash_code_unique');
      } catch (err) {
        // Índice pode não existir, ignorar erro
      }
      await queryInterface.removeColumn('orders', 'hash_code');
    }
  }
};

