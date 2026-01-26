import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /admin/gifts?page=1&limit=10&search=...
 * Списък с подаръци (admin)
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

    const [gifts, total] = await Promise.all([
      prisma.gift.findMany({
        skip,
        take: limit,
        where,
        orderBy: { id: "desc" },
      }),
      prisma.gift.count({ where }),
    ]);

    return NextResponse.json({
      gifts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[GIFTS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch gifts" }, { status: 500 });
  }
}

/**
 * POST /admin/gifts
 * Създаване на нов подарък
 * Body: { name, price, description?, imageUrl? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price, description, imageUrl } = body;

    if (!name || price == null) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const gift = await prisma.gift.create({
      data: {
        name,
        price: Number(price),
        description: description ?? null,
        imageUrl: imageUrl ?? null,
      },
    });

    return NextResponse.json(gift, { status: 201 });
  } catch (error) {
    console.error("[GIFTS_CREATE]", error);
    return NextResponse.json({ error: "Failed to create gift" }, { status: 500 });
  }
}
