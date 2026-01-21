// prisma/seed.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  const vitamins = await prisma.category.create({ data: { name: 'Витамини' } });
  const proteins = await prisma.category.create({ data: { name: 'Протеини' } });
  const multivitamins = await prisma.category.create({ data: { name: 'Мултивитамини' } });

  await prisma.product.createMany({
    data: [
      { name: 'Vitamin C 500mg', price: 15.0, categoryId: vitamins.id },
      { name: 'Vitamin D 1000 IU', price: 20.0, categoryId: vitamins.id },
      { name: 'Whey Protein 1kg', price: 50.0, categoryId: proteins.id },
      { name: 'Casein Protein 1kg', price: 55.0, categoryId: proteins.id },
      { name: 'Multivitamin Complex', price: 25.0, categoryId: multivitamins.id },
    ],
  });

  await prisma.gift.createMany({
    data: [
      { name: 'Шейкър' },
      { name: 'Смути чаша' },
      { name: 'Стикери' },
    ],
  });

  await prisma.user.create({
    data: { name: 'Test User', email: 'test@example.com' },
  });

  console.log('Seeding finished!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
