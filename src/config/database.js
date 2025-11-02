require('dotenv').config();

const common = {
  define: { underscored: true, freezeTableName: false },
  logging: process.env.DB_LOGGING === 'true' ? console.log : false
};

module.exports = {
  development: {
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || './dev.sqlite',
    ...common
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    ...common
  },
  production: {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    ...common
  }
};
