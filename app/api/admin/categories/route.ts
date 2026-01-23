import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const search = url.searchParams.get("search") || "";

    // Ако има search, филтрираме по име
    const where = search
      ? {
          name: {
            contains: search, // substring search
          },
        }
      : {};

    // Вземаме категории + общ брой
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: limit,
        where,
        orderBy: { id: "desc" },
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

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const category = await prisma.category.create({ data });
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
