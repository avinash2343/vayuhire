import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

const router = express.Router();

// ONE-TIME setup route — DELETE this file after use!
router.get('/', async (req, res) => {
  try {
    const adminEmail = 'admin@vayuhire.com';
    
    // Check if admin already exists
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existing) {
      return res.json({ success: true, message: 'Admin user already exists!' });
    }

    // Create admin user
    const password_hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password_hash,
        role: 'admin',
      },
    });

    res.json({ success: true, message: 'Admin user created! Email: admin@vayuhire.com, Password: admin123. NOW DELETE THIS ROUTE!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
