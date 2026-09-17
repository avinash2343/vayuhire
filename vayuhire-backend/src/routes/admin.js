import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as adminCtrl from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/login', adminCtrl.login);
// ONE-TIME: Create admin user — DELETE after use!
router.get('/setup-admin', async (req, res) => {
  try {
    const bcrypt = await import('bcryptjs');
    const { default: prisma } = await import('../config/db.js');
    const adminEmail = 'admin@vayuhire.com';
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existing) return res.json({ success: true, message: 'Admin already exists!' });
    const password_hash = await bcrypt.default.hash('admin123', 10);
    await prisma.user.create({ data: { email: adminEmail, password_hash, role: 'admin' } });
    res.json({ success: true, message: 'Admin created! Now DELETE this route.' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

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
