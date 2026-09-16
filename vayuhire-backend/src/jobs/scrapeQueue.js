import { Queue } from 'bullmq';
import redisClient from '../config/redis.js';

export const scrapeQueue = new Queue('scrape-jobs', { connection: redisClient });

export const queueScrapeJob = async (sourceId) => {
  if (!redisClient) {
    console.warn('Redis not available. Scrape job not queued.');
    return;
  }
  await scrapeQueue.add('scrape', { sourceId });
};
