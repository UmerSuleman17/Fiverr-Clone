const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'in-progress', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentIntentId: { type: String },
    deliveredAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

OrderSchema.index({ buyer: 1, seller: 1, status: 1 });

module.exports = mongoose.model('Order', OrderSchema);