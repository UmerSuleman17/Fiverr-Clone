const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }], // Cloudinary URLs
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

GigSchema.index({ title: 'text', description: 'text' });
GigSchema.index({ category: 1, price: 1, avgRating: -1 });

module.exports = mongoose.model('Gig', GigSchema);