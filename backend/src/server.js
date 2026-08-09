const http = require('http');
const app = require('./app');
const { PORT, MONGO_URI } = require('./config');
const mongoose = require('mongoose');
const { initRedis } = require('./config/redis');
const { socketHandler } = require('./sockets');

const server = http.createServer(app);

// Socket.IO
const io = require('socket.io')(server, {
  cors: { origin: process.env.FRONTEND_URL || '*' },
});
socketHandler(io);

// Attach io to app for use in controllers
app.set('io', io);

// Connect MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    try {
      await initRedis();
    } catch (redisErr) {
      console.warn('Redis connection failed (non-critical):', redisErr.message);
    }
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));