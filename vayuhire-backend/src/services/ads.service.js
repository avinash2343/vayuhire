import prisma from '../config/db.js';

export const getActiveAdForPlacement = async (placement) => {
  const now = new Date();
  const ads = await prisma.ad.findMany({
    where: {
      placement,
      is_active: true,
      start_date: { lte: now },
      end_date: { gte: now }
    }
  });
  
  if (ads.length === 0) return null;
  
  // Random selection if multiple ads are active for the same placement
  const randomIndex = Math.floor(Math.random() * ads.length);
  return ads[randomIndex];
};
