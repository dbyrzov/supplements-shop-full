import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET category по ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  return NextResponse.json(category);
}

// PUT update category
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });

  const data = await req.json();
  const updated = await prisma.category.update({ where: { id }, data });

  return NextResponse.json(updated);
}

// DELETE category
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ message: "Category deleted successfully" });
}
