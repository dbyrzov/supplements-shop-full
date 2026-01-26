import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/categories/edit/:id
 * Връща категория по ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { subcategories: true, products: true },
    });

    if (!category)
      return NextResponse.json({ error: "Category not found" }, { status: 404 });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/categories/edit/:id
 * Актуализира категория по ID
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });

  try {
    const body = await req.json();
    const { name, description, imageUrl, slug } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name,
        description: description ?? null,
        imageUrl: imageUrl ?? null,
        slug: slug ?? name.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[CATEGORY_UPDATE]", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/categories/edit/:id
 * Изтрива категория по ID
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
