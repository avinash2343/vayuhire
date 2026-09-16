import prisma from '../config/db.js';

export const getCompanies = async (req, res, next) => {
  try {
    const companies = await prisma.company.findMany({
      where: { is_active: true },
      include: {
        _count: {
          select: { jobs: { where: { is_active: true } } }
        }
      }
    });

    res.json({ success: true, data: companies });
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await prisma.company.findUnique({
      where: { id, is_active: true }
    });

    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

export const getCompanyJobs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = { company_id: id, is_active: true };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
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
