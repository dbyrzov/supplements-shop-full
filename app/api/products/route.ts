import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/products?category=...&search=...
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let products = await prisma.product.findMany({
      include: { category: true },
    });

    if (category) {
      products = products.filter(
        (p: any) => p.category?.name === category
      );
    }

    if (search) {
      const s = search.toLowerCase();
      products = products.filter((p: any) =>
        p.name.toLowerCase().includes(s)
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      promoPrice,
      promoEndDate,
      categoryId,
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        promoPrice: promoPrice ? Number(promoPrice) : null,
        promoEndDate: promoEndDate ? new Date(promoEndDate) : null,
        categoryId: Number(categoryId),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
