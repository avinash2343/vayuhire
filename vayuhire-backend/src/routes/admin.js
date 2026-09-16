import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as adminCtrl from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/login', adminCtrl.login);

router.use(authenticate);

router.get('/companies', adminCtrl.getCompanies);
router.post('/companies', adminCtrl.createCompany);
router.put('/companies/:id', adminCtrl.updateCompany);
router.delete('/companies/:id', adminCtrl.deleteCompany);

router.get('/jobs', adminCtrl.getJobs);
router.put('/jobs/:id', adminCtrl.updateJob);
router.delete('/jobs/:id', adminCtrl.deleteJob);

router.post('/scrape/trigger/:sourceId', adminCtrl.triggerScrape);
router.get('/scrape/logs', adminCtrl.getScrapeLogs);

router.get('/ads', adminCtrl.getAds);
router.post('/ads', adminCtrl.createAd);
router.put('/ads/:id', adminCtrl.updateAd);
router.delete('/ads/:id', adminCtrl.deleteAd);
router.get('/ads/analytics', adminCtrl.getAdsAnalytics);

export default router;
