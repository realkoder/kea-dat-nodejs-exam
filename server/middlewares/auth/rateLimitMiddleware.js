import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisConnection from '../../redis/connection.js';

import prefixedLogger from '../../utils/logger.js';

const redisLogger = prefixedLogger('🔄 [Redis]: ');

await redisConnection.connect();

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.API_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.API_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisConnection.client.sendCommand(args),
    expiry: parseInt(process.env.API_WINDOW_MS) / 1000 || 15 * 60, // 15 minutes
  }),
  handler: (req, res) => {
    redisLogger.info(`General api rate limit exceeded for: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
  },
  skip: (req, res) => {
    redisLogger.info(`logged general api request`);
    return false;
  },
});

// More strict rate limiter for sensitive operations
export const sensitiveLimiter = rateLimit({
  windowMs: parseInt(process.env.SENSITIVE_WINDOW_MS) || 5 * 60 * 1000, // 5 minutes
  max: parseInt(process.env.SENSITIVE_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisConnection.client.sendCommand(args),
    expiry: parseInt(process.env.SENSITIVE_WINDOW_MS) / 1000 || 5 * 60, // 5 minutes
  }),
  handler: (req, res) => {
    redisLogger.info(`Sensitive rate limit exceeded for: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests on sensitive endpoint, please try again later.',
    });
  },
  skip: (req, res) => {
    redisLogger.info(`logged sensitive api request`);
    return false;
  },
});
