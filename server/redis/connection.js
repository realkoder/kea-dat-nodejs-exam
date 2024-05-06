import 'dotenv/config';
import { createClient } from 'redis';
import prefixedLogger from '../utils/logger.js';

const redisLogger = prefixedLogger('🔄 [Redis]: ');

const { REDIS_LINK } = process.env;

class RedisConnection {
  static instance = null;
  redisClient = null;

  constructor() {
    if (!RedisConnection.instance) {
      RedisConnection.instance = this;
    }
    return RedisConnection.instance;
  }

  get client() {
    return this.redisClient;
  }

  connect() {
    if (this.redisClient) {
      return Promise.resolve(this.redisClient);
    }

    const client = createClient({
      url: REDIS_LINK,
    });

    client.on('error', error => {
      redisLogger.error(`Redis client error: ${error.message}`);
    });

    return client
      .connect()
      .then(() => {
        this.redisClient = client;
        redisLogger.info('Successfully connected to Redis');
        return this.redisClient;
      })
      .catch(error => {
        redisLogger.error(`Error connecting to Redis: ${error.message}`);
        client.quit(); // Ensure no resources are left hanging
        throw error;
      });
  }

  disconnect() {
    if (this.redisClient) {
      return this.redisClient
        .disconnect()
        .then(() => {
          redisLogger.info('Redis connection closed');
        })
        .catch(error => {
          redisLogger.error(`Error disconnecting from Redis: ${error.message}`);
          throw error;
        });
    } else {
      return Promise.resolve();
    }
  }
}

const redisConnection = new RedisConnection();

process.on('SIGINT', () => {
  redisConnection
    .disconnect()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
});

process.on('SIGTERM', () => {
  redisConnection
    .disconnect()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
});

export default redisConnection;
