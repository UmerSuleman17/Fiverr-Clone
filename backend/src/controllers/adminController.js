const User = require('../models/User');
const Gig = require('../models/Gig');
const AdminLog = require('../models/AdminLog');

// List all users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find().select('-password -refreshToken').skip(skip).limit(parseInt(limit)),
      User.countDocuments(),
    ]);
    res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ban user
exports.banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = false;
    await user.save();
    await AdminLog.create({
      admin: req.user.id,
      action: 'ban user',
      targetType: 'User',
      targetId: user._id,
      reason: req.body.reason || 'No reason provided',
    });
    res.json({ message: 'User banned' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List gigs for moderation
exports.getGigs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [gigs, total] = await Promise.all([
      Gig.find().populate('seller', 'name email').skip(skip).limit(parseInt(limit)),
      Gig.countDocuments(),
    ]);
    res.json({ gigs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Disable gig
exports.disableGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    gig.isActive = false;
    await gig.save();
    await AdminLog.create({
      admin: req.user.id,
      action: 'disable gig',
      targetType: 'Gig',
      targetId: gig._id,
      reason: req.body.reason || 'No reason',
    });
    res.json({ message: 'Gig disabled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};