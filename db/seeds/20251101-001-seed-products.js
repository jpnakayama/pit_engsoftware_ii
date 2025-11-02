'use strict';
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('products', [
      { name: 'Cupcake Chocolate', description: 'Massa de cacau, cobertura de brigadeiro', price_cents: 900, image_url: null, created_at: new Date(), updated_at: new Date() },
      { name: 'Cupcake Baunilha', description: 'Clássico, cobertura de creme', price_cents: 850, image_url: null, created_at: new Date(), updated_at: new Date() },
      { name: 'Cupcake do Mês', description: 'Sabor especial da casa', price_cents: 1000, is_cupcake_of_month: true, month_discount_percent: 20, image_url: null, created_at: new Date(), updated_at: new Date() }
    ]);
  },
  async down (queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
