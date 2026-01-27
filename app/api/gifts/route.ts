// app/api/gifts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // твоят Prisma client

export async function GET(req: NextRequest) {
  try {
    // Връщаме всички подаръци подредени по дата или цена
    const gifts = await prisma.gift.findMany({
      orderBy: { price: "asc" },
    });

    return NextResponse.json({ gifts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch gifts" }, { status: 500 });
  }
}
