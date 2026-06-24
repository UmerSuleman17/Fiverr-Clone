const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  },
  { timestamps: true }
);

WishlistSchema.index({ user: 1, gig: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);