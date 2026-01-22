import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { userId, productIds, giftId, total } = req.body;

      // Създаване на поръчка
      const order = await prisma.order.create({
        data: {
          userId: Number(userId),
          total: Number(total),
          products: {
            connect: productIds.map((id: number) => ({ id })),
          },
          gift: giftId ? { connect: { id: Number(giftId) } } : undefined,
        },
        include: { products: true, gift: true },
      });

      return res.status(201).json(order);
    }

    if (req.method === 'GET') {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ message: 'userId required' });

      const orders = await prisma.order.findMany({
        where: { userId: Number(userId) },
        include: { products: true, gift: true },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(orders);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
}
