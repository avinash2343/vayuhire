import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import prisma from '../config/db.js';

const anthropic = new Anthropic({
  apiKey: env.claudeApiKey || 'mock-key',
});

export const extractJobs = async (cleanedContent, companyName, retryCount = 0) => {
  try {
    const prompt = `You are a job listing extractor. From the given career page content for ${companyName}, return ONLY a JSON array. For each job listing found, extract: { "title": "", "location": "", "job_type": "", "salary_range": "", "apply_url": "", "description_summary": "" }. If a field is not found, use null. Return ONLY valid JSON array, no extra text.\n\nContent:\n${cleanedContent}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      system: 'You are an API that only returns raw JSON arrays.',
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    let textContent = response.content[0].text;
    
    // Clean potential markdown formatting
    if (textContent.startsWith('```json')) {
      textContent = textContent.replace(/```json\n?/, '').replace(/```$/, '');
    }

    const jobs = JSON.parse(textContent);
    
    if (!Array.isArray(jobs)) {
      throw new Error('Response is not a JSON array');
    }
    
    return jobs;
  } catch (error) {
    if (retryCount < 2) {
      console.log(`Failed to parse AI response, retrying (${retryCount + 1}/2)...`);
      return extractJobs(cleanedContent, companyName, retryCount + 1);
    }
    throw new Error(`AI extraction failed: ${error.message}`);
  }
};

export const validateAndDedup = async (extractedJobs, companyId, sourceUrl) => {
  const newJobs = [];
  const updatedJobs = [];
  const baseUrl = new URL(sourceUrl).origin;

  for (const job of extractedJobs) {
    if (!job.title || !job.apply_url) continue;

    // Resolve relative URLs
    if (job.apply_url.startsWith('/')) {
      job.apply_url = `${baseUrl}${job.apply_url}`;
    }

    try {
      const existingJob = await prisma.job.findFirst({
        where: {
          company_id: companyId,
          title: job.title,
          apply_url: job.apply_url
        }
      });

      if (existingJob) {
        updatedJobs.push({ ...job, id: existingJob.id });
      } else {
        newJobs.push(job);
      }
    } catch (err) {
      console.error('Error checking duplicate:', err);
    }
  }

  return { newJobs, updatedJobs };
};
