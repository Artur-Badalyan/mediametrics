import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.create({
    data: {
      name: "Demo Company",
      settings: {
        allowSameDay: false,
        allowNextDay: true,
        openingHours: {
          mon: [8, 18],
          tue: [8, 18],
          wed: [8, 18],
          thu: [8, 18],
          fri: [8, 18],
          sat: [10, 16],
          sun: []
        }
      }
    }
  });

  const password = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      passwordHash: password,
      role: Role.admin,
      companyId: company.id
    }
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@demo.com',
      passwordHash: password,
      role: Role.staff,
      companyId: company.id
    }
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@demo.com',
      passwordHash: password,
      role: Role.customer,
      companyId: company.id
    }
  });

  const service1 = await prisma.service.create({
    data: {
      name: 'Consultation',
      description: 'General consulting service',
      companyId: company.id
    }
  });

  const service2 = await prisma.service.create({
    data: {
      name: 'Therapy',
      description: 'Therapy session',
      companyId: company.id
    }
  });

  console.log({ company, admin, staff, customer, service1, service2 });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});