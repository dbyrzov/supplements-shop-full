import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/products?category=...&search=...
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get("category");
    const search = searchParams.get("search");

    let products = await prisma.product.findMany({
      include: {
        category: true,
        subcategory: true,
        brand: true,
        variants: true,
        images: true,
        tags: { include: { tag: true } },
        nutritionProfile: true,
        ingredients: true,
      },
    });

    if (categoryName) {
      products = products.filter(
        (p) => p.category?.name === categoryName
      );
    }

    if (search) {
      const s = search.toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(s)
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Body:
 * {
 *   name, description, brandId, categoryId, subcategoryId,
 *   variants: [{ sku, grams, price, stock, flavorId? }],
 *   images: [{ url }],
 *   nutritionProfile: { servingSize, calories, protein, carbs, fats },
 *   ingredients: [{ name, amount }],
 *   tagIds: [number]
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      brandId,
      categoryId,
      subcategoryId,
      variants = [],
      images = [],
      nutritionProfile,
      ingredients = [],
      tagIds = [],
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug: body.slug,
        description,
        brandId: brandId ? Number(brandId) : undefined,
        categoryId: Number(categoryId),
        subcategoryId: Number(subcategoryId),
        variants: {
          create: variants.map((v: any) => ({
            sku: v.sku,
            grams: Number(v.grams),
            price: Number(v.price),
            stock: v.stock ? Number(v.stock) : 0,
            flavorId: v.flavorId ? Number(v.flavorId) : undefined,
          })),
        },
        images: {
          create: images.map((img: any) => ({ url: img.url })),
        },
        nutritionProfile: nutritionProfile
          ? {
              create: {
                servingSize: nutritionProfile.servingSize,
                calories: Number(nutritionProfile.calories),
                protein: Number(nutritionProfile.protein),
                carbs: Number(nutritionProfile.carbs),
                fats: Number(nutritionProfile.fats),
              },
            }
          : undefined,
        ingredients: {
          create: ingredients.map((ing: any) => ({
            name: ing.name,
            amount: ing.amount,
          })),
        },
        tags: {
          create: tagIds.map((id: number) => ({ tagId: Number(id) })),
        },
      },
      include: {
        variants: true,
        images: true,
        nutritionProfile: true,
        ingredients: true,
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
