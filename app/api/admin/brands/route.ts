import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        skip,
        take: limit,
        where,
        orderBy: { id: "desc" },
        include: { products: true }, // брой продукти по желание
      }),
      prisma.brand.count({ where }),
    ]);

    return NextResponse.json({
      brands,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[ADMIN_BRANDS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, slug, logo } = data;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: { name, slug, logo: logo || null },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_BRANDS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}
