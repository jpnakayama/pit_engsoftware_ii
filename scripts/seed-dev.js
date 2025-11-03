#!/usr/bin/env node
const { sequelize, Product } = require('../src/models');

(async () => {
  await sequelize.sync();
  const base = [
    { name: 'Cupcake Chocolate', price_cents: 1500, description: 'Cacau 50%', is_cupcake_of_month: true },
    { name: 'Cupcake Morango', price_cents: 1200, description: 'Cobertura de morango' },
    { name: 'Cupcake Baunilha', price_cents: 1100, description: 'Clássico' },
    { name: 'Cupcake Limão', price_cents: 1300, description: 'Toque cítrico' },
  ];
  for (const p of base) await Product.findOrCreate({ where: { name: p.name }, defaults: p });
  console.log('✅ Seeds ok');
  process.exit(0);
})();
