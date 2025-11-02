// src/middlewares/errorHandler.js
function errorHandler(err, req, res, _next) {
    // log básico no server
    console.error(err);
  
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(status).json({ message, status });
  }
  
  module.exports = errorHandler;
  