const Order = require('../models/Order');
const Gig = require('../models/Gig');
const stripe = require('../services/stripe');
const sendEmail = require('../services/email');
const io = req.app.get('io');

// In createOrder, after saving order
io.to(order.seller.toString()).emit('newOrder', { orderId: order._id });
// Create order and initiate Stripe PaymentIntent
exports.createOrder = async (req, res) => {
  try {
    const { gigId } = req.body;
    const gig = await Gig.findById(gigId).populate('seller', 'stripeAccountId');
    if (!gig || !gig.isActive) return res.status(404).json({ message: 'Gig not found' });

    // Check if seller has Stripe account
    if (!gig.seller.stripeAccountId) {
      return res.status(400).json({ message: 'Seller not onboarded for payments' });
    }

    // Create PaymentIntent with destination charge
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(gig.price * 100), // in cents
      currency: 'usd',
      application_fee_amount: Math.round(gig.price * 0.1 * 100), // 10% platform fee
      transfer_data: {
        destination: gig.seller.stripeAccountId,
      },
      metadata: { gigId: gig._id.toString(), buyerId: req.user.id },
    });

    // Create order in pending state
    const order = await Order.create({
      buyer: req.user.id,
      seller: gig.seller._id,
      gig: gig._id,
      price: gig.price,
      paymentIntentId: paymentIntent.id,
      status: 'pending',
    });

    // Send notification email to seller
    await sendEmail(
      gig.seller.email,
      'New Order',
      `<p>You have a new order for "${gig.title}" from ${req.user.name}.</p>`
    );

    res.status(201).json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get orders for current user (buyer/seller)
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const filter = {};
    if (req.user.role === 'buyer') filter.buyer = req.user.id;
    else if (req.user.role === 'seller') filter.seller = req.user.id;
    else if (req.user.role === 'admin') { /* no filter */ }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('gig', 'title images')
        .populate('buyer', 'name avatar')
        .populate('seller', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark order as completed (seller marks delivered, then buyer can mark complete or auto)
exports.completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.seller.toString() !== req.user.id && order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    // If seller marks delivered
    if (req.user.role === 'seller' && order.status === 'paid') {
      order.status = 'delivered';
      order.deliveredAt = new Date();
      await order.save();
      // Notify buyer
      await sendEmail(order.buyer.email, 'Order Delivered', 'Your order has been delivered.');
    }
    // If buyer marks complete
    else if (req.user.role === 'buyer' && order.status === 'delivered') {
      order.status = 'completed';
      order.completedAt = new Date();
      await order.save();
      // Trigger payout to seller (Stripe transfer) - already done via destination charges,
      // but we can release any hold if using separate transfer.
      // For destination charges, funds are automatically available to seller after settlement.
    } else {
      return res.status(400).json({ message: 'Cannot complete order in current state' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};