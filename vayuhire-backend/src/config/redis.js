import Redis from 'ioredis';
import { env } from './env.js';

let redisClient = null;

// Only connect to Redis if REDIS_URL is explicitly set and not localhost placeholder
const redisUrl = env.redisUrl;
const isValidRedis = redisUrl && !redisUrl.includes('localhost') && !redisUrl.includes('127.0.0.1');

if (isValidRedis) {
  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy(times) {
        if (times > 3) {
          console.warn('Redis: Max retries reached, giving up.');
          return null; // Stop retrying
        }
        return Math.min(times * 200, 2000);
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });
  } catch (error) {
    console.warn('Failed to initialize Redis:', error.message);
    redisClient = null;
  }
} else {
  console.log('Redis: No valid REDIS_URL found. Scraper queue disabled. App will run without Redis.');
}

export default redisClient;
