const router = require('express').Router();
const { placeOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrder } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, placeOrder);
router.get('/', protect, getAllOrder);
router.get('/user', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
