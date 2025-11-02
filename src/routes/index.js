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

router.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth
router.post('/auth/signup', AuthController.signup);
router.post('/auth/login', AuthController.login);

// Produtos
router.get('/products', ProductController.list);

// Carrinho
router.post('/cart/items', auth, CartController.addItem);
router.get('/cart', auth, CartController.list);
router.delete('/cart/items/:id', auth, CartController.removeItem);

// Checkout
router.post('/checkout/pix', auth, CheckoutController.pix);

// Pedidos
router.post('/orders/:id/pay', auth, OrderController.confirmPayment);
router.get('/orders/:id/status', auth, OrderController.status);
router.post('/orders/:id/advance', auth, OrderController.advance);
router.get('/orders', auth, OrderController.history);

// Fidelidade
router.get('/loyalty/summary', auth, LoyaltyController.summary);

// Reviews (pós-compra)
router.post('/orders/:id/review', auth, ReviewController.create);

module.exports = router;
