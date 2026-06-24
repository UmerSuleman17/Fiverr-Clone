const express = require('express');
const { getProfile, updateProfile, getUserById, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload'); // multer config for avatar
const router = express.Router();

// Protected routes
router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, upload.single('avatar'), updateProfile);

// Public (or protected for admin) - get user by ID
router.get('/:id', authMiddleware, getUserById); // you can make it public if needed

// Admin only: delete user
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;