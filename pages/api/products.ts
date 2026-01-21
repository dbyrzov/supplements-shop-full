import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { category, search } = req.query;
      let products = await prisma.product.findMany({
        include: { category: true },
      });

      if (category) {
        products = products.filter(p => p.category.name === category);
      }

      if (search) {
        const s = (search as string).toLowerCase();
        products = products.filter(p => p.name.toLowerCase().includes(s));
      }

      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      // Админ добавяне на продукт
      const { name, description, price, promoPrice, promoEndDate, categoryId } = req.body;
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: Number(price),
          promoPrice: promoPrice ? Number(promoPrice) : null,
          promoEndDate: promoEndDate ? new Date(promoEndDate) : null,
          categoryId: Number(categoryId),
        },
      });
      return res.status(201).json(product);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
}
