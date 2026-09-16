import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Admin
  const adminEmail = 'admin@vayuhire.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    const password_hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password_hash,
        role: 'admin',
      },
    });
    console.log(`Admin user created: ${adminEmail}`);
  }

  // 2. Create Companies
  const companiesData = [
    {
      name: 'TechCorp',
      career_page_url: 'https://example.com/careers/techcorp',
      website: 'https://techcorp.example.com',
      industry: 'Software',
    },
    {
      name: 'GlobalHealth',
      career_page_url: 'https://example.com/careers/globalhealth',
      website: 'https://globalhealth.example.com',
      industry: 'Healthcare',
    }
  ];

  for (const c of companiesData) {
    const company = await prisma.company.create({
      data: {
        ...c,
        scrape_sources: {
          create: {
            url: c.career_page_url
          }
        }
      }
    });
    console.log(`Created company: ${company.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
