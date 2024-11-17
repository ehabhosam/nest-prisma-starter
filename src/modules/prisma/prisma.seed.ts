import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createUsers() {
  const admin = await prisma.user.findUnique({
    where: {
      email: 'admin',
    },
  });

  if (!admin) {
    await prisma.user.create({
      data: {
        email: 'admin',
        password_hash: await bcrypt.hash('admin', 10),
        role: 'ADMIN',
        phone: '0000000000',
        full_name: 'Admin',
      },
    });
  }

  // try to fetch seller user otherwise create him
  const seller = await prisma.user.findUnique({
    where: {
      email: 'seller@optics.com',
    },
  });

  if (!seller) {
    await prisma.user.create({
      data: {
        email: 'seller@optics.com',
        password_hash: await bcrypt.hash('seller', 10),
        role: 'SELLER',
        phone: '1111111111',
        full_name: 'Seller',
      },
    });
  }

  // try to fetch client user otherwise create him
  const client = await prisma.user.findUnique({
    where: {
      email: 'client@optics.com',
    },
  });

  if (!client) {
    await prisma.user.create({
      data: {
        email: 'client@optics.com',
        password_hash: await bcrypt.hash('client', 10),
        role: 'CLIENT',
        phone: '2222222222',
        full_name: 'Client',
      },
    });
  }
}
async function main() {
  try {
    console.log('⌛ Seeding database...');
    await createUsers();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
