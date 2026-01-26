import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET brand by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid brand ID" }, { status: 400 });

  const brand = await prisma.brand.findUnique({ where: { id }, include: { products: true } });
  if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  return NextResponse.json(brand);
}

// PUT update brand
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid brand ID" }, { status: 400 });

  const data = await req.json();
  const { name, slug, logo } = data;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  const updated = await prisma.brand.update({
    where: { id },
    data: { name, slug, logo: logo || null },
  });

  return NextResponse.json(updated);
}

// DELETE brand
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid brand ID" }, { status: 400 });

  await prisma.brand.delete({ where: { id } });
  return NextResponse.json({ message: "Brand deleted successfully" });
}
