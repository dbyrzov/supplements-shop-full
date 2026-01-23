import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<Promise<{ id: string }> > }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }>  }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });

  const data = await req.json();
  const updated = await prisma.product.update({ where: { id }, data });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }>  }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ message: "Product deleted successfully" });
}
