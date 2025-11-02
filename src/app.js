require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/', routes);

// Error handler (deve ser o último middleware)
app.use(errorHandler);

// Conexão com o banco
sequelize.authenticate()
  .then(() => console.log('DB conectado'))
  .catch((err) => console.error('Erro DB:', err));

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
