import express from 'express';
import { getJobs, getJobById } from '../controllers/jobs.controller.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);

export default router;
