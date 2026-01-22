import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = Number(params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.status !== 'PENDING') {
      return NextResponse.json(
        { message: 'Order cannot be cancelled' },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx: any) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: 'Cancel failed' },
      { status: 500 }
    );
  }
}
