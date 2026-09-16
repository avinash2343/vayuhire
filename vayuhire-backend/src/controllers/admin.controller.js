import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { env } from '../config/env.js';
import { queueScrapeJob } from '../jobs/scrapeQueue.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: '24h' });
    res.json({ success: true, data: { token } });
  } catch (error) {
    next(error);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const companies = await prisma.company.findMany();
    res.json({ success: true, data: companies });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req, res, next) => {
  try {
    const { name, logo_url, career_page_url, website, industry } = req.body;
    const company = await prisma.company.create({
      data: {
        name, logo_url, career_page_url, website, industry,
        scrape_sources: {
          create: { url: career_page_url }
        }
      }
    });
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await prisma.company.update({
      where: { id },
      data: req.body
    });
    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.company.delete({ where: { id } });
    res.json({ success: true, message: 'Company deleted' });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const jobs = await prisma.job.findMany({
      include: { company: true },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.update({
      where: { id },
      data: req.body
    });
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.job.delete({ where: { id } });
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
};

export const triggerScrape = async (req, res, next) => {
  try {
    const { sourceId } = req.params;
    await queueScrapeJob(sourceId);
    res.json({ success: true, message: 'Scrape job queued' });
  } catch (error) {
    next(error);
  }
};

export const getScrapeLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      prisma.scrapeLog.findMany({
        skip,
        take: limitNum,
        orderBy: { run_at: 'desc' },
        include: { scrape_source: { include: { company: true } } }
      }),
      prisma.scrapeLog.count()
    ]);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAds = async (req, res, next) => {
  try {
    const ads = await prisma.ad.findMany({ orderBy: { created_at: 'desc' } });
    res.json({ success: true, data: ads });
  } catch (error) {
    next(error);
  }
};

export const createAd = async (req, res, next) => {
  try {
    const ad = await prisma.ad.create({ data: req.body });
    res.status(201).json({ success: true, data: ad });
  } catch (error) {
    next(error);
  }
};

export const updateAd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ad = await prisma.ad.update({ where: { id }, data: req.body });
    res.json({ success: true, data: ad });
  } catch (error) {
    next(error);
  }
};

export const deleteAd = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.ad.delete({ where: { id } });
    res.json({ success: true, message: 'Ad deleted' });
  } catch (error) {
    next(error);
  }
};

export const getAdsAnalytics = async (req, res, next) => {
  try {
    const ads = await prisma.ad.findMany({
      select: {
        id: true, advertiser_name: true, placement: true,
        impressions_count: true, clicks_count: true
      }
    });
    res.json({ success: true, data: ads });
  } catch (error) {
    next(error);
  }
};
