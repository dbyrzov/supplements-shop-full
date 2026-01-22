import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, trackingNumber } = await req.json();

    const order = await prisma.order.update({
      where: { id: Number(params.id) },
      data: {
        status,
        trackingNumber,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update order' },
      { status: 500 }
    );
  }
}
