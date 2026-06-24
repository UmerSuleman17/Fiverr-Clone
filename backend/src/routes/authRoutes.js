const express = require('express');
const { register, login, googleAuth, refreshToken, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/refresh', refreshToken);
router.post('/logout', authMiddleware, logout);

module.exports = router;