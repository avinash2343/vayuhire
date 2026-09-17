import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';

import jobsRoutes from './routes/jobs.js';
import companiesRoutes from './routes/companies.js';
import adminRoutes from './routes/admin.js';
import adsRoutes from './routes/ads.js';
import setupRoutes from './routes/setup.js';
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/jobs', jobsRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/setup-admin', setupRoutes);
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use(errorHandler);

export default app;
