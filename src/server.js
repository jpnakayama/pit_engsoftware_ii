require('dotenv').config();

// Garantir que NODE_ENV seja 'production' no Render
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

