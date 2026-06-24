const express = require('express');
const { getUsers, banUser, getGigs, disableGig } = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const router = express.Router();

router.use(authMiddleware, roleCheck('admin'));

router.get('/users', getUsers);
router.put('/users/:id/ban', banUser);
router.get('/gigs', getGigs);
router.put('/gigs/:id/disable', disableGig);

module.exports = router;