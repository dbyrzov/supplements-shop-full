import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid gift ID" }, { status: 400 });

  const gift = await prisma.gift.findUnique({ where: { id } });
  if (!gift) return NextResponse.json({ error: "Gift not found" }, { status: 404 });

  return NextResponse.json(gift);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid gift ID" }, { status: 400 });

  const data = await req.json();
  const updated = await prisma.gift.update({ where: { id }, data });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid gift ID" }, { status: 400 });

  await prisma.gift.delete({ where: { id } });
  return NextResponse.json({ message: "Gift deleted successfully" });
}
