const express = require('express');
const { getOrCreateConversation, getConversations, getMessages } = require('../controllers/conversationController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getConversations);
router.get('/create', getOrCreateConversation); // GET with ?sellerId
router.get('/:id/messages', getMessages);

module.exports = router;