import Redis from 'ioredis';
import { env } from './env.js';

let redisClient = null;

const redisUrl = env.redisUrl;
const isValidRedis = redisUrl && !redisUrl.includes('localhost') && !redisUrl.includes('127.0.0.1');

if (isValidRedis) {
  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      }
    });
    redisClient.on('error', (err) => console.error('Redis error:', err.message));
    redisClient.on('connect', () => console.log('Redis connected'));
  } catch (error) {
    console.warn('Redis init failed:', error.message);
    redisClient = null;
  }
} else {
  console.log('Redis: Skipped (no valid URL). Scraper queue disabled.');
}

export default redisClient;
