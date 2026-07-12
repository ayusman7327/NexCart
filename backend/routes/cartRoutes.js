const router = require('express').Router();
const { getCart, syncCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.get('/',                    protect, getCart);
router.post('/',                   protect, syncCart);
router.post('/add',                protect, addToCart);
router.delete('/remove/:productId', protect, removeFromCart);
router.delete('/clear',            protect, clearCart);

module.exports = router;
