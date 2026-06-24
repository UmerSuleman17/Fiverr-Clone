const express = require('express');
const router = express.Router();
const stripe = require('../services/stripe');
const { STRIPE_WEBHOOK_SECRET } = require('../config');
const Order = require('../models/Order');
const sendEmail = require('../services/email');

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    const order = await Order.findById(orderId);
    if (order) {
      order.status = 'paid';
      await order.save();
      // Notify buyer and seller
      await sendEmail(order.buyer.email, 'Payment Successful', 'Your payment was successful.');
      await sendEmail(order.seller.email, 'Order Paid', 'Your order has been paid.');
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    // handle failure
  }

  res.json({ received: true });
});

module.exports = router;