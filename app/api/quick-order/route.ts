import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, phone, email, items, giftId } = body;

    // 1️⃣ Валидация на задължителните полета
    if (!firstName || !phone || !email) {
      return new Response(
        JSON.stringify({ error: "Име, телефон и email са задължителни" }),
        { status: 400 }
      );
    }

    // 2️⃣ Намери или създай потребител
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: firstName,
          phone,
          email,
          password: "", // бърза поръчка – няма реален login
        },
      });
    }

    // 3️⃣ Създай поръчката
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0),
        shippingAddress: "", // няма доставка за бърза поръчка
        paymentMethod: "cash", // плащане при доставка
        items: {
          create: [
            // Добави всички продукти
            ...items.map((i: any) => ({
              productVariantId: i.variantId,
              quantity: i.quantity,
              priceAtPurchase: i.price,
            })),
            // Добави подарък като отделен OrderItem, но с цена 0
            ...(giftId
              ? [
                  {
                    productVariantId: giftId, // тук ще трябва да е productVariantId на подаръка
                    quantity: 1,
                    priceAtPurchase: 0,
                  },
                ]
              : []),
          ],
        },
      },
      include: { items: true },
    });

    return new Response(JSON.stringify({ orderId: order.id, userId: user.id }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
