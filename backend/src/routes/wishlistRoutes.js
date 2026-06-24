const express = require('express');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.post('/', addToWishlist);
router.get('/', getWishlist);
router.delete('/:gigId', removeFromWishlist);

module.exports = router;