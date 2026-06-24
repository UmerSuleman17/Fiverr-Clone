const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Send a message via REST (used for fallback or when socket not available)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    if (!text) return res.status(400).json({ message: 'Message text required' });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      text,
    });
    await message.populate('sender', 'name avatar');

    // Emit via socket if needed (we can get io from app)
    const io = req.app.get('io');
    if (io) {
      io.to(conversationId).emit('message', message);
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark message as read (REST)
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: req.user.id } },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};