const express = require('express');
const { getNotifications, markAsRead, markAllRead, deleteNotification } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllRead);
router.delete('/:id', deleteNotification);

module.exports = router;