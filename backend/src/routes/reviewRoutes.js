const express = require('express');
const { addReview, getReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all reviews for a gig (public)
router.get('/:gigId', getReviews);

// Add a review (authenticated buyer only)
router.post('/:gigId', authMiddleware, addReview);

module.exports = router;