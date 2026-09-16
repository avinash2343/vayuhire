import express from 'express';
import { getActiveAds, trackClick, trackImpression } from '../controllers/ads.controller.js';

const router = express.Router();

router.get('/active', getActiveAds);
router.post('/:id/click', trackClick);
router.post('/:id/impression', trackImpression);

export default router;
