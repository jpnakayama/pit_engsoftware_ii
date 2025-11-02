// src/routes/index.js
const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/ProductController');

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Produtos (vitrine)
router.get('/products', ProductController.list);

module.exports = router;
