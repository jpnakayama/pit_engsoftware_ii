require('dotenv').config();

const common = {
  define: { underscored: true, freezeTableName: false },
  logging: process.env.DB_LOGGING === 'true' ? console.log : false
};

// Função para parsear DATABASE_URL se disponível (comum no Render)
function parseDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      return {
        dialect: 'postgres',
        host: url.hostname,
        port: url.port || 5432,
        database: url.pathname.slice(1), // Remove a barra inicial
        username: url.username,
        password: url.password,
        ...common,
        dialectOptions: {
          ssl: process.env.DATABASE_URL.includes('sslmode=require') || process.env.DB_SSL === 'true' ? {
            require: true,
            rejectUnauthorized: false
          } : false
        }
      };
    } catch (error) {
      console.error('Erro ao parsear DATABASE_URL:', error);
      return null;
    }
  }
  return null;
}

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
  production: (() => {
    // Tenta usar DATABASE_URL primeiro (formato do Render)
    const urlConfig = parseDatabaseUrl();
    if (urlConfig) return urlConfig;
    
    // Fallback para variáveis individuais
    return {
      dialect: process.env.DB_DIALECT || 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      ...common,
      dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    };
  })()
};
