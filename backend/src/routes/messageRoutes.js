const express = require('express');
const { sendMessage, markAsRead } = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.post('/', sendMessage);
router.put('/:messageId/read', markAsRead);

module.exports = router;