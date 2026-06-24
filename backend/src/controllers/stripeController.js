const stripe = require('../services/stripe');
const Order = require('../models/Order');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('gig').populate('seller', 'stripeAccountId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: order.gig.title },
            unit_amount: Math.round(order.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/orders?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/orders?canceled=true`,
      metadata: { orderId: order._id.toString() },
      payment_intent_data: {
        application_fee_amount: Math.round(order.price * 0.1 * 100),
        transfer_data: {
          destination: order.seller.stripeAccountId,
        },
      },
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};