require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');

const routes = require('./routes'); // index.js dentro de src/routes
const errorHandler = require('./middlewares/errorHandler'); // seu handler global

const app = express();

/* -------------------------
   Config básica de servidor
-------------------------- */
app.disable('x-powered-by');
app.use(cors({
  origin: true, // libera localhost / ferramentas
  credentials: false
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

/* -------------------------
   Arquivos estáticos (frontend mínimo)
   -> serve src/public/*
-------------------------- */
app.use(express.static(path.join(__dirname, 'public')));

/* -------------------------
   Rotas da API
-------------------------- */
app.use('/', routes);

/* -------------------------
   Erros de validação (celebrate/joi)
   -> precisa vir DEPOIS das rotas
-------------------------- */
app.use(errors());

/* -------------------------
   404 para rotas não encontradas (API)
   (estáticos já foram tratados acima)
-------------------------- */
app.use((req, res, next) => {
  // se pediu HTML, deixa o estático/responder 404 simples
  if (req.accepts('html')) return res.status(404).send('Página não encontrada.');
  return res.status(404).json({ message: 'Not Found' });
});

/* -------------------------
   Handler global de erros
-------------------------- */
app.use(errorHandler);

/* -------------------------
   Export / start
-------------------------- */
module.exports = app;

// Permite rodar diretamente: `node src/app.js`
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server up on http://localhost:${PORT}`);
  });
}
