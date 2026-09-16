import prisma from '../config/db.js';
import { getActiveAdForPlacement } from '../services/ads.service.js';

export const getActiveAds = async (req, res, next) => {
  try {
    const { placement } = req.query;
    if (!placement) {
      return res.status(400).json({ success: false, error: 'Placement query param is required' });
    }

    const ad = await getActiveAdForPlacement(placement);
    res.json({ success: true, data: ad });
  } catch (error) {
    next(error);
  }
};

export const trackClick = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.ad.update({
      where: { id },
      data: { clicks_count: { increment: 1 } }
    });
    res.json({ success: true, message: 'Click tracked' });
  } catch (error) {
    next(error);
  }
};

export const trackImpression = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.ad.update({
      where: { id },
      data: { impressions_count: { increment: 1 } }
    });
    res.json({ success: true, message: 'Impression tracked' });
  } catch (error) {
    next(error);
  }
};
