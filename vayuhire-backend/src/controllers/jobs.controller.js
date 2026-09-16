import prisma from '../config/db.js';

export const getJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, location, job_type, company_id, keyword } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = { is_active: true };

    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (job_type) where.job_type = job_type;
    if (company_id) where.company_id = company_id;
    if (keyword) where.title = { contains: keyword, mode: 'insensitive' };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { company: { select: { name: true, logo_url: true } } },
        skip,
        take: limitNum,
        orderBy: [{ is_featured: 'desc' }, { created_at: 'desc' }]
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        jobs,
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

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({
      where: { id, is_active: true },
      include: { company: true }
    });

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};
