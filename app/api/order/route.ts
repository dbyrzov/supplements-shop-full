import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateOrderInput } from "@/types/order";

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
        { message: "Invalid order data" },
        { status: 400 }
      );
    }

    // -------------------------
    // Load variants
    // -------------------------
    const variantIds = items.map((i: any) => i.variantId);

    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true }, // ако искаш информация за продукта
    });

    if (variants.length !== items.length) {
      return NextResponse.json(
        { message: "Some variants not found" },
        { status: 404 }
      );
    }

    // -------------------------
    // Calculate totals
    // -------------------------
    let subtotal = 0;

    const orderItems = items.map((item: any) => {
      const variant = variants.find((v) => v.id === item.variantId)!;

      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${variant.product.name}`);
      }

      subtotal += variant.price * item.quantity;

      return {
        productVariantId: variant.id,
        quantity: item.quantity,
        priceAtPurchase: variant.price,
      };
    });

    // -------------------------
    // Shipping / tax / coupon
    // -------------------------
    const shippingCost = subtotal > 100 ? 0 : 5;
    const tax = subtotal * 0.2; // 20% VAT
    const discount = couponCode === "PROMO10" ? subtotal * 0.1 : 0;

    const total = subtotal + shippingCost + tax - discount;

    // -------------------------
    // Transaction
    // -------------------------
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: "PENDING",
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
            include: {
              variant: { include: { product: true, flavor: true } },
            },
          },
        },
      });

      // Update stock for each variant
      for (const item of orderItems) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("[ORDER_CREATE]", error);

    return NextResponse.json(
      { message: error.message ?? "Order creation failed" },
      { status: 500 }
    );
  }
}
