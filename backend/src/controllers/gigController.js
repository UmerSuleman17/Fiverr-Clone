const Gig = require('../models/Gig');
const Review = require('../models/Review');

// Create gig
exports.createGig = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const images = req.files ? req.files.map(f => f.path) : [];
    const gig = await Gig.create({
      seller: req.user.id,
      title,
      description,
      category,
      price,
      images,
    });
    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all gigs with search, filter, pagination
exports.getGigs = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, minPrice, maxPrice, rating, sort } = req.query;
    const query = { isActive: true };
    if (search) {
      query.$text = { $search: search };
    }
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (rating) query.avgRating = { $gte: parseFloat(rating) };

    let sortOption = {};
    if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'rating') sortOption.avgRating = -1;
    else sortOption.createdAt = -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [gigs, total] = await Promise.all([
      Gig.find(query).populate('seller', 'name avatar').sort(sortOption).skip(skip).limit(parseInt(limit)),
      Gig.countDocuments(query),
    ]);
    res.json({
      gigs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single gig with reviews
exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('seller', 'name avatar bio');
    if (!gig || !gig.isActive) return res.status(404).json({ message: 'Gig not found' });
    const reviews = await Review.find({ gig: gig._id }).populate('buyer', 'name avatar');
    res.json({ ...gig.toObject(), reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update gig (seller only)
exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    if (gig.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not your gig' });
    }
    const { title, description, category, price } = req.body;
    if (title) gig.title = title;
    if (description) gig.description = description;
    if (category) gig.category = category;
    if (price) gig.price = price;
    if (req.files && req.files.length) {
      gig.images = req.files.map(f => f.path);
    }
    await gig.save();
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete gig (soft delete or hard? we'll set isActive false)
exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    if (gig.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not your gig' });
    }
    gig.isActive = false;
    await gig.save();
    res.json({ message: 'Gig disabled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};