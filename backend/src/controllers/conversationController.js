const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Get or create a conversation between buyer and seller
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { sellerId } = req.query;
    if (!sellerId) return res.status(400).json({ message: 'sellerId required' });

    const buyerId = req.user.id;
    // Find existing conversation with both participants
    let conversation = await Conversation.findOne({
      participants: { $all: [buyerId, sellerId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [buyerId, sellerId]
      });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all conversations for current user
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'name avatar')
      .sort({ updatedAt: -1 });

    // For each conversation, get last message
    const result = await Promise.all(conversations.map(async (conv) => {
      const lastMsg = await Message.findOne({ conversation: conv._id })
        .sort({ createdAt: -1 })
        .populate('sender', 'name');
      return { ...conv.toObject(), lastMessage: lastMsg };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get messages for a conversation (with pagination)
exports.getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findById(id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [messages, total] = await Promise.all([
      Message.find({ conversation: id })
        .populate('sender', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Message.countDocuments({ conversation: id })
    ]);

    res.json({
      messages: messages.reverse(), // oldest first
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};