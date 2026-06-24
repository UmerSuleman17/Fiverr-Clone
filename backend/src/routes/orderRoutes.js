const express = require('express');
const { createOrder, getOrders, completeOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/:id/complete', completeOrder);

module.exports = router;