require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => console.log('DB conectado'))
  .catch((err) => console.error('Erro DB:', err));

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
