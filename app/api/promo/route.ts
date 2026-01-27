import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message1: "🎉 Подарък към всяка поръчка над 20 евро!",
    message2: "🎉 Безплатна доставка за поръчка над 40 евро!",
  });
}