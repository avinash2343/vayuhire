import Redis from 'ioredis';
import { env } from './env.js';

let redisClient = null;

try {
  redisClient = new Redis(env.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
} catch (error) {
  console.error('Failed to initialize Redis:', error);
}

export default redisClient;
