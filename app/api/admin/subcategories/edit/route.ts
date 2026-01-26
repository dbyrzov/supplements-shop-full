import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET subcategory by ID
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid subcategory ID" }, { status: 400 });

  const subcategory = await prisma.subcategory.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!subcategory) return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });

  return NextResponse.json(subcategory);
}

/**
 * PUT update subcategory
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid subcategory ID" }, { status: 400 });

  const body = await req.json();
  const { name, categoryId, slug } = body;

  if (!name || !categoryId) {
    return NextResponse.json({ error: "Name and categoryId are required" }, { status: 400 });
  }

  const updated = await prisma.subcategory.update({
    where: { id },
    data: {
      name,
      categoryId: Number(categoryId),
      slug: slug ?? name.toLowerCase().replace(/\s+/g, "-"),
    },
  });

  return NextResponse.json(updated);
}

/**
 * DELETE subcategory
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid subcategory ID" }, { status: 400 });

  await prisma.subcategory.delete({ where: { id } });
  return NextResponse.json({ message: "Subcategory deleted successfully" });
}
