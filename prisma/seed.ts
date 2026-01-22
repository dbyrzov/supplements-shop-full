import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ========================
  // Categories
  // ========================
  const categoriesData = [
    { name: "Протеини", description: "Протеинови добавки за мускулна маса", imageUrl: "/images/categories/proteins.jpg" },
    { name: "Витамини", description: "Витамини и минерали за здраве", imageUrl: "/images/categories/vitamins.jpg" },
    { name: "Предтренировъчни", description: "Добавки за енергия преди тренировка", imageUrl: "/images/categories/preworkout.jpg" },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  // ========================
  // Users
  // ========================
  const usersData = [
    { name: "Иван Иванов", email: "ivan@example.com", password: "123456" },
    { name: "Мария Петрова", email: "maria@example.com", password: "123456" },
  ];

  for (const user of usersData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  // ========================
  // Products
  // ========================
  const productsData = [
    {
      name: "Whey Protein 2kg",
      description: "Висококачествен суроватъчен протеин за мускулен растеж",
      price: 79.99,
      stock: 50,
      categoryId: 1,
      imageUrl: "/images/products/whey.jpg",
      sku: "WP2000",
      brand: "MuscleLab",
      tags: "протеин,мускули,спорт",
    },
    {
      name: "Vitamin C 500mg",
      description: "Витамин C за имунна система",
      price: 12.5,
      stock: 100,
      categoryId: 2,
      imageUrl: "/images/products/vitc.jpg",
      sku: "VC500",
      brand: "HealthPlus",
      tags: "витамини,имунитет",
    },
    {
      name: "PreWorkout Extreme",
      description: "Енергия и концентрация преди тренировка",
      price: 39.99,
      stock: 30,
      categoryId: 3,
      imageUrl: "/images/products/preworkout.jpg",
      sku: "PWE001",
      brand: "EnergyBoost",
      tags: "енергия,фокус,спорт",
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { sku: prod.sku! },
      update: {},
      create: prod,
    });
  }

  // ========================
  // Gifts
  // ========================
  const giftsData = [
    { name: "Шейкър", description: "Пластмасов шейкър за протеин", price: 5.99, imageUrl: "/images/gifts/shaker.jpg" },
    { name: "Лента за упражнения", description: "Еластична лента за тренировки", price: 7.5, imageUrl: "/images/gifts/band.jpg" },
  ];

  for (const gift of giftsData) {
    await prisma.gift.upsert({
      where: { name: gift.name },
      update: {},
      create: gift,
    });
  }

  // ========================
  // Orders + OrderItems
  // ========================
  const order1 = await prisma.order.create({
    data: {
      userId: 1,
      total: 92.49,
      status: "PROCESSING",
      paymentMethod: "card",
      shippingAddress: "София, ул. Пример 12",
      shippingCost: 5.0,
      items: {
        create: [
          { productId: 1, quantity: 1, price: 79.99 },
          { productId: 2, quantity: 1, price: 12.5 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: 2,
      total: 39.99,
      status: "SHIPPED",
      paymentMethod: "paypal",
      shippingAddress: "Пловдив, бул. Тест 45",
      items: {
        create: [
          { productId: 3, quantity: 1, price: 39.99 },
        ],
      },
    },
  });

  // ========================
  // Reviews
  // ========================
  const reviewsData = [
    { userId: 1, productId: 1, rating: 5, comment: "Много качествен протеин, вкусен е!" },
    { userId: 2, productId: 2, rating: 4, comment: "Добър витамин, леко скъп" },
    { userId: 2, productId: 3, rating: 5, comment: "Енергията е страхотна преди тренировка" },
  ];

  for (const rev of reviewsData) {
    await prisma.review.create({
      data: rev,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
