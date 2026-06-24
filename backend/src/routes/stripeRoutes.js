const express = require('express');
const { createCheckoutSession } = require('../controllers/stripeController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/create-checkout-session', authMiddleware, createCheckoutSession);

module.exports = router;