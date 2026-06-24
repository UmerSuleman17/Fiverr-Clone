const User = require('../models/User');
const cloudinary = require('../services/cloudinary');

// Get own profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update own profile (including avatar upload)
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio) user.bio = bio;

    // If avatar file uploaded via multer (Cloudinary)
    if (req.file) {
      // req.file.path is the Cloudinary URL if using upload middleware
      user.avatar = req.file.path;
    }

    await user.save();
    res.json({ message: 'Profile updated', user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get any user profile (public)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken -email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete own account (or admin can delete)
exports.deleteUser = async (req, res) => {
  try {
    // Only admin can delete any user, or user can delete self
    if (req.user.role === 'admin' || req.user.id === req.params.id) {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User deleted' });
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};