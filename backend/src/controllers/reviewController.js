const Review = require('../models/Review');
const Gig = require('../models/Gig');
const Order = require('../models/Order');

// Add review (only if order completed and buyer)
exports.addReview = async (req, res) => {
  try {
    const { gigId } = req.params;
    const { rating, comment } = req.body;
    const buyerId = req.user.id;

    // Check if buyer has completed order for this gig
    const order = await Order.findOne({ buyer: buyerId, gig: gigId, status: 'completed' });
    if (!order) {
      return res.status(400).json({ message: 'You must complete the order before reviewing' });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ gig: gigId, buyer: buyerId });
    if (existing) return res.status(400).json({ message: 'Already reviewed' });

    const review = await Review.create({ gig: gigId, buyer: buyerId, rating, comment });

    // Update gig rating
    const gig = await Gig.findById(gigId);
    const total = gig.totalReviews + 1;
    gig.avgRating = ((gig.avgRating * gig.totalReviews) + rating) / total;
    gig.totalReviews = total;
    await gig.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all reviews for a gig
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ gig: req.params.gigId })
      .populate('buyer', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};