const Stripe = require('stripe');
const { STRIPE_SECRET_KEY } = require('../config');
const logger = require('../utils/logger');

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Create a PaymentIntent for an order
const createPaymentIntent = async (amount, currency, metadata, destination, applicationFee) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'usd',
      application_fee_amount: applicationFee ? Math.round(applicationFee * 100) : undefined,
      transfer_data: destination ? { destination } : undefined,
      metadata,
    });
    return paymentIntent;
  } catch (error) {
    logger.error('Error creating PaymentIntent:', error);
    throw error;
  }
};

// Create a Checkout Session
const createCheckoutSession = async (lineItems, metadata, successUrl, cancelUrl, mode = 'payment') => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    });
    return session;
  } catch (error) {
    logger.error('Error creating Checkout Session:', error);
    throw error;
  }
};

// Verify webhook signature
const verifyWebhookSignature = (body, signature, secret) => {
  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret);
    return event;
  } catch (error) {
    logger.error('Error verifying webhook signature:', error);
    throw error;
  }
};

// Create transfer to seller (for manual payout)
const createTransfer = async (amount, currency, destination, metadata) => {
  try {
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: currency || 'usd',
      destination,
      metadata,
    });
    return transfer;
  } catch (error) {
    logger.error('Error creating transfer:', error);
    throw error;
  }
};

module.exports = {
  stripe,
  createPaymentIntent,
  createCheckoutSession,
  verifyWebhookSignature,
  createTransfer,
};