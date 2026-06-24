const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

// Online users map: userId -> Set of socket IDs
const onlineUsers = new Map();

const socketHandler = (io) => {
  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      logger.error('Socket auth error:', error);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    
    // Join user's personal room
    socket.join(`user:${userId}`);
    
    // Track online users
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);
    
    // Notify others that user is online
    socket.broadcast.emit('userOnline', { userId });
    
    logger.info(`User ${userId} connected`);

    // Join conversation room
    socket.on('joinConversation', (conversationId) => {
      socket.join(`conv:${conversationId}`);
      logger.info(`User ${userId} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leaveConversation', (conversationId) => {
      socket.leave(`conv:${conversationId}`);
      logger.info(`User ${userId} left conversation ${conversationId}`);
    });

    // Send message
    socket.on('sendMessage', async ({ conversationId, text }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }
        
        // Check if user is participant
        if (!conversation.participants.includes(userId)) {
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }
        
        // Create message
        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          text,
        });
        
        // Populate sender info
        await message.populate('sender', 'name avatar');
        
        // Emit to conversation room
        io.to(`conv:${conversationId}`).emit('newMessage', message);
        
        // Create notification for other participants
        const otherParticipants = conversation.participants.filter(
          p => p.toString() !== userId
        );
        
        for (const participantId of otherParticipants) {
          await Notification.create({
            user: participantId,
            type: 'message',
            content: `New message in conversation`,
            data: { conversationId, messageId: message._id },
          });
          
          // Emit notification to participant's personal room
          io.to(`user:${participantId}`).emit('notification', {
            type: 'message',
            message: 'New message received',
          });
        }
        
      } catch (error) {
        logger.error('Socket sendMessage error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(`conv:${conversationId}`).emit('userTyping', {
        userId,
        conversationId,
        isTyping,
      });
    });

    // Mark message as read
    socket.on('markRead', async ({ messageId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;
        
        if (!message.readBy.includes(userId)) {
          message.readBy.push(userId);
          await message.save();
          
          // Notify sender
          io.to(`user:${message.sender}`).emit('messageRead', {
            messageId,
            userId,
          });
        }
      } catch (error) {
        logger.error('Socket markRead error:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          socket.broadcast.emit('userOffline', { userId });
        }
      }
      logger.info(`User ${userId} disconnected`);
    });
  });
};

// Helper function to get online users
const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

module.exports = {
  socketHandler,
  getOnlineUsers,
};