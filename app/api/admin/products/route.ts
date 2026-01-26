import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /admin/products?page=1&limit=10&search=...
 * Връща списък с продукти (admin)
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const search = url.searchParams.get("search") || "";

    const where = search ? { name: { contains: search } } : {};

    // Use findMany for both data and total count
    const allMatchingProducts = await prisma.product.findMany({
      where,
      select: { id: true }, // only select id for performance
    });
    const total = allMatchingProducts.length;

    const products = await prisma.product.findMany({
      skip,
      take: limit,
      where,
      orderBy: { id: "desc" },
      include: {
        brand: true,
        category: true,
        subcategory: true,
        variants: true,
        images: true,
        nutritionProfile: true,
      },
    });

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

/**
 * POST /admin/products
 * Създава нов продукт
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      brandId,
      categoryId,
      subcategoryId,
      variants,
      images,
      nutritionProfile,
      ingredients,
      tags,
    } = body;

    if (!name || !slug || !categoryId || !subcategoryId) {
      return NextResponse.json(
        { error: "Name, slug, categoryId and subcategoryId are required" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description ?? null,
        brandId: brandId ?? undefined,
        categoryId,
        subcategoryId,
        variants: variants ? { create: variants } : undefined,
        images: images ? { create: images } : undefined,
        nutritionProfile: nutritionProfile
          ? { create: nutritionProfile }
          : undefined,
        ingredients: ingredients ? { create: ingredients } : undefined,
        tags: tags
          ? { create: tags.map((t: number) => ({ tagId: t })) }
          : undefined,
      },
      include: {
        brand: true,
        category: true,
        subcategory: true,
        variants: true,
        images: true,
        nutritionProfile: true,
        ingredients: true,
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("[PRODUCTS_CREATE]", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
