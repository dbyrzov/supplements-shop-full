import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const productId = parseInt(routeParams.id, 10);

  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        brand: true,
        category: true,
        subcategory: true,
        variants: {
          include: {
            flavor: true,
          },
        },
        images: true,
        nutritionProfile: true,
        ingredients: true,
        tags: { include: { tag: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
