const Wishlist = require('../models/Wishlist');

exports.addToWishlist = async (req, res) => {
  try {
    const { gigId } = req.body;
    const wishlist = await Wishlist.create({ user: req.user.id, gig: gigId });
    res.status(201).json(wishlist);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already in wishlist' });
    res.status(500).json({ message: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id }).populate('gig');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ user: req.user.id, gig: req.params.gigId });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};