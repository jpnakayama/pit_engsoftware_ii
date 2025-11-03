// src/routes/index.js
const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/ProductController');
const AuthController = require('../controllers/AuthController');
const CartController = require('../controllers/CartController');
const CheckoutController = require('../controllers/CheckoutController');
const OrderController = require('../controllers/OrderController');
const LoyaltyController = require('../controllers/LoyaltyController');
const ReviewController = require('../controllers/ReviewController');

const auth = require('../middlewares/auth');
const v = require('../middlewares/validators');

// Health
router.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth
router.post('/auth/signup', v.authSignup, AuthController.signup);
router.post('/auth/login', v.authLogin, AuthController.login);
router.get('/me', auth, AuthController.me);

// Produtos
router.get('/products', v.productsList, ProductController.list);

// Carrinho
router.post('/cart/items', auth, v.cartAddItem, CartController.addItem);
router.get('/cart', auth, CartController.list);
router.delete('/cart/items/:id', auth, v.orderIdParam, CartController.removeItem);

// Checkout
router.post('/checkout/pix', auth, v.checkoutPix, CheckoutController.pix);

// Pedidos
router.get('/orders', auth, OrderController.history);
router.get('/orders/:id/status', auth, v.orderIdParam, OrderController.status);
router.post('/orders/:id/pay', auth, v.orderIdParam, OrderController.confirmPayment);
router.post('/orders/:id/advance', auth, v.orderIdParam, v.orderAdvance, OrderController.advance);

// Reviews
router.post('/orders/:id/review', auth, v.orderIdParam, v.orderReview, ReviewController.create);

// Fidelidade
router.get('/loyalty/summary', auth, LoyaltyController.summary);

module.exports = router;
