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
// Middleware customizado para tratar erros do Celebrate antes do handler padrão
app.use((err, req, res, next) => {
  // Verificar se é erro do Celebrate
  if (err.isJoi || err.isCelebrate || err.name === 'ValidationError') {
    let message = 'Dados inválidos';
    
    // Tentar extrair detalhes do erro
    let allErrors = [];
    
    // Formato do Celebrate: err.details pode ser Map ou objeto
    if (err.details) {
      if (err.details instanceof Map) {
        // Se for Map, iterar sobre os valores
        err.details.forEach((value) => {
          if (Array.isArray(value)) {
            allErrors.push(...value);
          }
        });
      } else if (typeof err.details === 'object') {
        // Se for objeto, verificar body, params, query
        if (err.details.body) allErrors.push(...err.details.body);
        if (err.details.params) allErrors.push(...err.details.params);
        if (err.details.query) allErrors.push(...err.details.query);
      }
    }
    
    // Se não encontrou em details, tentar em joi.details
    if (allErrors.length === 0 && err.joi && err.joi.details) {
      allErrors = err.joi.details;
    }
    
    // Procurar erro de senha primeiro
    if (allErrors.length > 0) {
      const passwordError = allErrors.find(e => {
        const path = Array.isArray(e.path) ? e.path : (e.path ? [e.path] : []);
        return path.some(p => String(p).includes('password'));
      });
      
      if (passwordError && passwordError.message) {
        message = passwordError.message;
      } else if (allErrors[0].message) {
        message = allErrors[0].message;
      }
    }
    
    return res.status(400).json({ message });
  }
  
  // Se não for erro do Celebrate, passar para o próximo handler
  next(err);
});

// Handler padrão do Celebrate para outros casos
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
