import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const gifts = [
    {
      name: "Whey Protein Gift Set",
      description: "Комплект протеинови шейкове и аксесоари за фитнес.",
      imageUrl: "/images/gifts/whey-protein-set.jpg",
      price: 49.99,
    },
    {
      name: "Vitamin Booster Pack",
      description: "Комплект мултивитамини и минерали за ежедневна енергия.",
      imageUrl: "/images/gifts/vitamin-booster.jpg",
      price: 29.99,
    },
    {
      name: "Organic Snack Box",
      description: "Кутия с органични здравословни закуски.",
      imageUrl: "/images/gifts/organic-snack-box.jpg",
      price: 24.5,
    },
    {
      name: "Fitness Water Bottle",
      description: "Стилна бутилка за вода с вместимост 750ml.",
      imageUrl: "/images/gifts/fitness-water-bottle.jpg",
      price: 14.99,
    },
    {
      name: "Yoga Mat Gift Pack",
      description: "Комплект за йога – постелка и аксесоари.",
      imageUrl: "/images/gifts/yoga-mat-pack.jpg",
      price: 39.99,
    },
  ];

  for (const gift of gifts) {
    await prisma.gift.upsert({
      where: { name: gift.name },
      update: {},
      create: gift,
    });
  }

  console.log("🎁 Seeded Gifts successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
