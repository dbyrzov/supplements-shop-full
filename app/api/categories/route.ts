import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/categories
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            brand: true,
            subcategory: true,
            variants: true,
            images: true,
            tags: { include: { tag: true } },
          },
        },
        subcategories: true,
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Body: { name, description?, imageUrl?, slug? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, imageUrl, slug } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description ?? null,
        imageUrl: imageUrl ?? null,
        slug: slug ?? name.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
