import express from 'express';
import { getCompanies, getCompanyById, getCompanyJobs } from '../controllers/companies.controller.js';

const router = express.Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.get('/:id/jobs', getCompanyJobs);

export default router;
