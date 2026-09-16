import { Worker } from 'bullmq';
import redisClient from '../config/redis.js';
import prisma from '../config/db.js';
import { scrapeCareerPage, cleanHtml } from '../services/scraper.service.js';
import { extractJobs, validateAndDedup } from '../services/aiExtractor.service.js';

export const createScrapeWorker = () => {
  if (!redisClient) {
    console.warn('Redis not available. Scrape worker not started.');
    return null;
  }

  const worker = new Worker('scrape-jobs', async (job) => {
    const { sourceId } = job.data;
    
    let scrapeLog;
    
    try {
      const source = await prisma.scrapeSource.findUnique({
        where: { id: sourceId },
        include: { company: true }
      });
      
      if (!source) throw new Error('Scrape source not found');

      scrapeLog = await prisma.scrapeLog.create({
        data: {
          scrape_source_id: sourceId,
          status: 'running'
        }
      });

      console.log(`[Worker] Scraping ${source.url} for ${source.company.name}`);
      
      const rawHtml = await scrapeCareerPage(source.url);
      const cleanedText = cleanHtml(rawHtml);
      
      const extractedJobs = await extractJobs(cleanedText, source.company.name);
      
      const { newJobs, updatedJobs } = await validateAndDedup(extractedJobs, source.company_id, source.url);
      
      // Mark missing as inactive
      const activeTitles = [...newJobs, ...updatedJobs].map(j => j.title);
      
      await prisma.job.updateMany({
        where: {
          company_id: source.company_id,
          source_scrape_id: sourceId,
          title: { notIn: activeTitles }
        },
        data: { is_active: false }
      });
      
      // Insert new jobs
      let insertedCount = 0;
      for (const newJob of newJobs) {
        await prisma.job.create({
          data: {
            company_id: source.company_id,
            title: newJob.title,
            description: newJob.description_summary,
            location: newJob.location,
            job_type: newJob.job_type,
            salary_range: newJob.salary_range,
            apply_url: newJob.apply_url,
            source_scrape_id: sourceId,
            is_active: true
          }
        });
        insertedCount++;
      }
      
      // Update existing jobs to be active
      for (const updatedJob of updatedJobs) {
        await prisma.job.update({
          where: { id: updatedJob.id },
          data: { is_active: true }
        });
      }

      await prisma.scrapeSource.update({
        where: { id: sourceId },
        data: { last_scraped_at: new Date() }
      });

      await prisma.scrapeLog.update({
        where: { id: scrapeLog.id },
        data: {
          status: 'completed',
          jobs_found: insertedCount + updatedJobs.length
        }
      });

      return { success: true, newJobs: insertedCount };
    } catch (error) {
      console.error('[Worker] Scrape failed:', error);
      
      if (scrapeLog) {
        await prisma.scrapeLog.update({
          where: { id: scrapeLog.id },
          data: {
            status: 'failed',
            error_message: error.message
          }
        });
      }
      throw error;
    }
  }, { connection: redisClient, concurrency: 1 });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  });

  return worker;
};
