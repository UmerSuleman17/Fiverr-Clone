const express = require('express');
const { createGig, getGigs, getGigById, updateGig, deleteGig } = require('../controllers/gigController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const router = express.Router();

// Public routes
router.get('/', getGigs);
router.get('/:id', getGigById);

// Protected routes (seller only)
router.post('/', authMiddleware, roleCheck('seller', 'admin'), upload.array('images', 5), createGig);
router.put('/:id', authMiddleware, roleCheck('seller', 'admin'), upload.array('images', 5), updateGig);
router.delete('/:id', authMiddleware, roleCheck('seller', 'admin'), deleteGig);

module.exports = router;
