const { getRedisClient } = require('../config/redis');
const { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX } = require('../config');

const rateLimiter = (windowSeconds = RATE_LIMIT_WINDOW, maxRequests = RATE_LIMIT_MAX) => {
  return async (req, res, next) => {
    try {
      const client = getRedisClient();
      const key = `rate:${req.ip}:${req.path}`;
      
      const current = await client.incr(key);
      
      if (current === 1) {
        await client.expire(key, windowSeconds);
      }
      
      if (current > maxRequests) {
        return res.status(429).json({ 
          message: 'Too many requests, please try again later.',
          retryAfter: windowSeconds
        });
      }
      
      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - current));
      
      next();
    } catch (error) {
      // If Redis fails, allow the request (fail open)
      console.error('Rate limiter error:', error);
      next();
    }
  };
};

module.exports = rateLimiter;