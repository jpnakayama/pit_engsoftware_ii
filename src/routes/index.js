const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/ProductController');
const AuthController = require('../controllers/AuthController');
const CartController = require('../controllers/CartController');
const CheckoutController = require('../controllers/CheckoutController');

const auth = require('../middlewares/auth');

router.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth
router.post('/auth/signup', AuthController.signup);
router.post('/auth/login', AuthController.login);

// Produtos (pública)
router.get('/products', ProductController.list);

// Cart (protegido)
router.post('/cart/items', auth, CartController.addItem);
router.get('/cart', auth, CartController.list);
router.delete('/cart/items/:id', auth, CartController.removeItem);

// Checkout Pix (protegido)
router.post('/checkout/pix', auth, CheckoutController.pix);

module.exports = router;
