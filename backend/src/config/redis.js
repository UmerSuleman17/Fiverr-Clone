const redis = require('redis');
const { REDIS_URL } = require('./index');

let client = null;

const initRedis = async () => {
  if (!client) {
    try {
      const redisClient = redis.createClient({
        url: REDIS_URL,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 2) {
              return false; // Stop reconnecting if Redis is unavailable
            }
            return 200;
          }
        }
      });
      
      redisClient.on('error', (err) => {
        // Silently log or ignore when Redis is absent
      });
      redisClient.on('connect', () => console.log('Redis connected'));
      
      await redisClient.connect();
      client = redisClient;
    } catch (err) {
      console.warn('Redis connection skipped (Redis not running). App will operate in fail-open mode.');
      client = null;
    }
  }
  return client;
};

const getRedisClient = () => {
  if (!client) {
    // Return dummy client that fails open if caller doesn't check
    return null;
  }
  return client;
};

const closeRedis = async () => {
  if (client) {
    try {
      await client.quit();
    } catch (e) {}
    client = null;
  }
};

module.exports = { initRedis, getRedisClient, closeRedis };