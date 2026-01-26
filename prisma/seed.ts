import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ========================
  // USERS
  // ========================
  const user1 = await prisma.user.create({
    data: {
      name: "Ivan Petrov",
      email: "ivan@example.com",
      password: "hashedpassword1",
      phone: "0888123456",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Maria Georgieva",
      email: "maria@example.com",
      password: "hashedpassword2",
    },
  });

  // ========================
  // BRANDS
  // ========================
  const brand1 = await prisma.brand.create({
    data: {
      name: "NutriGood",
      slug: "nutrigood",
      logo: "https://example.com/logos/nutrigood.png",
    },
  });

  const brand2 = await prisma.brand.create({
    data: {
      name: "HealthyLife",
      slug: "healthylife",
    },
  });

  // ========================
  // CATEGORIES & SUBCATEGORIES
  // ========================
  const cat1 = await prisma.category.create({
    data: {
      name: "Supplements",
      slug: "supplements",
      description: "Vitamins, minerals, and other dietary supplements",
      subcategories: {
        create: [
          { name: "Protein", slug: "protein" },
          { name: "Vitamins", slug: "vitamins" },
        ],
      },
    },
    include: { subcategories: true },
  });

  const cat2 = await prisma.category.create({
    data: {
      name: "Snacks",
      slug: "snacks",
      description: "Healthy snacks and bars",
      subcategories: {
        create: [
          { name: "Bars", slug: "bars" },
          { name: "Nuts & Seeds", slug: "nuts-seeds" },
        ],
      },
    },
    include: { subcategories: true },
  });

  // ========================
  // TAGS
  // ========================
  const tag1 = await prisma.tag.create({ data: { name: "Organic" } });
  const tag2 = await prisma.tag.create({ data: { name: "Gluten-Free" } });

  // ========================
  // PRODUCTS
  // ========================
  const product1 = await prisma.product.create({
    data: {
      name: "Whey Protein Vanilla",
      slug: "whey-protein-vanilla",
      description: "High-quality whey protein with vanilla flavor",
      brandId: brand1.id,
      categoryId: cat1.id,
      subcategoryId: cat1.subcategories[0].id,
      nutritionProfile: {
        create: {
          servingSize: "30g",
          calories: 120,
          protein: 24,
          carbs: 2,
          fats: 1.5,
        },
      },
      images: {
        create: [
          { url: "https://example.com/images/whey1.png", isPrimary: true },
          { url: "https://example.com/images/whey2.png" },
        ],
      },
      variants: {
        create: [
          { sku: "WP-VAN-500", grams: 500, price: 39.99, stock: 50 },
          { sku: "WP-VAN-1000", grams: 1000, price: 69.99, stock: 30 },
        ],
      },
      ingredients: {
        create: [
          { name: "Whey Protein Concentrate", amount: "25g" },
          { name: "Natural Vanilla Flavor", amount: "0.5g" },
        ],
      },
      tags: {
        create: [
          { tagId: tag1.id },
          { tagId: tag2.id },
        ],
      },
    },
    include: { variants: true, images: true, nutritionProfile: true },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Almond Protein Bar",
      slug: "almond-protein-bar",
      description: "Delicious protein bar with almonds",
      brandId: brand2.id,
      categoryId: cat2.id,
      subcategoryId: cat2.subcategories[0].id,
      nutritionProfile: {
        create: {
          servingSize: "50g",
          calories: 200,
          protein: 10,
          carbs: 18,
          fats: 8,
        },
      },
      images: {
        create: [
          { url: "https://example.com/images/bar1.png", isPrimary: true },
        ],
      },
      variants: {
        create: [{ sku: "ALMBAR-50", grams: 50, price: 2.99, stock: 100 }],
      },
      ingredients: {
        create: [
          { name: "Almonds", amount: "15g" },
          { name: "Whey Protein", amount: "10g" },
          { name: "Honey", amount: "5g" },
        ],
      },
      tags: {
        create: [{ tagId: tag1.id }],
      },
    },
    include: { variants: true },
  });

  // ========================
  // ORDERS
  // ========================
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      total: 69.99,
      status: "PENDING",
      paymentMethod: "CARD",
      shippingAddress: "Sofia, Bulgaria",
      items: {
        create: [
          {
            productVariantId: product1.variants[1].id,
            quantity: 1,
            priceAtPurchase: 69.99,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      total: 2.99,
      status: "PROCESSING",
      paymentMethod: "CASH",
      shippingAddress: "Plovdiv, Bulgaria",
      items: {
        create: [
          {
            productVariantId: product2.variants[0].id,
            quantity: 1,
            priceAtPurchase: 2.99,
          },
        ],
      },
    },
  });

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
