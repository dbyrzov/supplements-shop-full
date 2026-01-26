import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /admin/products/edit/:id
 * Връща продукт по ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });

  try {
    const product = await prisma.product.findUnique({
      where: { id },
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

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

/**
 * PUT /admin/products/edit/:id
 * Актуализира продукт
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });

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

    if (!name && !slug && !categoryId && !subcategoryId && !brandId &&
        !variants && !images && !nutritionProfile && !ingredients && !tags) {
      return NextResponse.json(
        { error: "At least one field is required to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? undefined,
        slug: slug ?? undefined,
        description: description ?? undefined,
        brandId: brandId ?? undefined,
        categoryId: categoryId ?? undefined,
        subcategoryId: subcategoryId ?? undefined,
        variants: variants ? { deleteMany: {}, create: variants } : undefined,
        images: images ? { deleteMany: {}, create: images } : undefined,
        nutritionProfile: nutritionProfile
          ? { upsert: { create: nutritionProfile, update: nutritionProfile } }
          : undefined,
        ingredients: ingredients ? { deleteMany: {}, create: ingredients } : undefined,
        tags: tags
          ? {
              deleteMany: {},
              create: tags.map((t: number) => ({ tagId: t })),
            }
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PRODUCT_UPDATE]", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

/**
 * DELETE /admin/products/edit/:id
 * Изтрива продукт по ID
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
