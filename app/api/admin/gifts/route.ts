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
      ? { name: { contains: search } }
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
    console.error("Error fetching gifts:", error);
    return NextResponse.json({ error: "Failed to fetch gifts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const gift = await prisma.gift.create({ data });
    return NextResponse.json(gift);
  } catch (error) {
    console.error("Error creating gift:", error);
    return NextResponse.json({ error: "Failed to create gift" }, { status: 500 });
  }
}
