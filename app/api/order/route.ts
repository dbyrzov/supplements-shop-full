import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateOrderInput } from '@/types/order';

/**
 * POST /api/order
 * Create order
 */
export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderInput = await req.json();
    const {
      userId,
      items,
      shippingAddress,
      paymentMethod,
      notes,
      couponCode,
    } = body;

    // -------------------------
    // Validation
    // -------------------------
    if (!userId || !items?.length || !shippingAddress) {
      return NextResponse.json(
        { message: 'Invalid order data' },
        { status: 400 }
      );
    }

    // -------------------------
    // Load products
    // -------------------------
    const productIds = items.map((i: any) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { message: 'Some products not found' },
        { status: 404 }
      );
    }

    // -------------------------
    // Calculate totals
    // -------------------------
    let subtotal = 0;

    const orderItems = items.map((item: any) => {
      const product = products.find((p: any) => p.id === item.productId)!;

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      subtotal += product.price * item.quantity;

      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // -------------------------
    // Shipping / tax / coupon
    // -------------------------
    const shippingCost = subtotal > 100 ? 0 : 5;
    const tax = subtotal * 0.2; // 20% VAT
    const discount = couponCode === 'PROMO10' ? subtotal * 0.1 : 0;

    const total = subtotal + shippingCost + tax - discount;

    // -------------------------
    // Transaction
    // -------------------------
    const order = await prisma.$transaction(async (tx: any) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          paymentMethod,
          shippingAddress,
          shippingCost,
          notes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // Update stock
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return createdOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('[ORDER_CREATE]', error);

    return NextResponse.json(
      { message: error.message ?? 'Order creation failed' },
      { status: 500 }
    );
  }
}
