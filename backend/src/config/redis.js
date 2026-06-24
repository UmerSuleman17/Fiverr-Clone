const redis = require('redis');
const { REDIS_URL } = require('./index');

let client;

const initRedis = async () => {
  if (!client) {
    client = redis.createClient({
      url: REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis connection failed after 10 retries');
            return new Error('Redis connection failed');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });
    
    client.on('error', (err) => console.error('Redis error:', err));
    client.on('connect', () => console.log('Redis connected'));
    
    await client.connect();
  }
  return client;
};

const getRedisClient = () => {
  if (!client) {
    throw new Error('Redis not initialized. Call initRedis first.');
  }
  return client;
};

const closeRedis = async () => {
  if (client) {
    await client.quit();
    client = null;
  }
};

module.exports = { initRedis, getRedisClient, closeRedis };