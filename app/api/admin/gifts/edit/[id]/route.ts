import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /admin/gifts/:id
 * Връща подарък по ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid gift ID" }, { status: 400 });

  try {
    const gift = await prisma.gift.findUnique({ where: { id } });

    if (!gift)
      return NextResponse.json({ error: "Gift not found" }, { status: 404 });

    return NextResponse.json(gift);
  } catch (error) {
    console.error("[GIFT_GET]", error);
    return NextResponse.json({ error: "Failed to fetch gift" }, { status: 500 });
  }
}

/**
 * PUT /admin/gifts/:id
 * Актуализира подарък по ID
 * Body: { name?, price?, description?, imageUrl? }
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid gift ID" }, { status: 400 });

  try {
    const body = await req.json();
    const { name, price, description, imageUrl } = body;

    if (!name && price == null && description == null && imageUrl == null) {
      return NextResponse.json(
        { error: "At least one field is required to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.gift.update({
      where: { id },
      data: {
        name: name ?? undefined,
        price: price != null ? Number(price) : undefined,
        description: description ?? undefined,
        imageUrl: imageUrl ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[GIFT_UPDATE]", error);
    return NextResponse.json({ error: "Failed to update gift" }, { status: 500 });
  }
}

/**
 * DELETE /admin/gifts/:id
 * Изтрива подарък по ID
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid gift ID" }, { status: 400 });

  try {
    await prisma.gift.delete({ where: { id } });
    return NextResponse.json({ message: "Gift deleted successfully" });
  } catch (error) {
    console.error("[GIFT_DELETE]", error);
    return NextResponse.json({ error: "Failed to delete gift" }, { status: 500 });
  }
}
