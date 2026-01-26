import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /admin/categories?page=1&limit=10&search=...
 * Административен списък на категориите с pagination
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const search = url.searchParams.get("search") || "";

    const where = search
      ? {
          name: { contains: search, mode: "insensitive" },
        }
      : {};

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: limit,
        where,
        orderBy: { id: "desc" },
        include: { subcategories: true }, // броим подкатегориите
      }),
      prisma.category.count({ where }),
    ]);

    return NextResponse.json({
      categories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

/**
 * POST /admin/categories
 * Създаване на нова категория
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
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
