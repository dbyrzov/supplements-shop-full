import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /admin/subcategories?page=1&limit=10&search=...
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const search = url.searchParams.get("search") || "";

    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const [subcategories, total] = await Promise.all([
      prisma.subcategory.findMany({
        skip,
        take: limit,
        where,
        orderBy: { id: "desc" },
        include: { category: true }, // Връща свързаната категория
      }),
      prisma.subcategory.count({ where }),
    ]);

    return NextResponse.json({
      subcategories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[SUBCATEGORIES_GET]", error);
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 });
  }
}

/**
 * POST /admin/subcategories
 * Body: { name, categoryId, slug? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, categoryId, slug } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: "Name and categoryId are required" }, { status: 400 });
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        slug: slug ?? name.toLowerCase().replace(/\s+/g, "-"),
        categoryId: Number(categoryId),
      },
    });

    return NextResponse.json(subcategory, { status: 201 });
  } catch (error) {
    console.error("[SUBCATEGORY_CREATE]", error);
    return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 });
  }
}
