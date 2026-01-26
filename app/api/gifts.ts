import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { page = '1', limit = '10', search = '' } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where = search
        ? { name: { contains: search as string, mode: 'insensitive' } }
        : {};

      const [gifts, total] = await Promise.all([
        prisma.gift.findMany({
          skip,
          take: parseInt(limit as string),
          where,
          orderBy: { id: 'desc' },
        }),
        prisma.gift.count({ where }),
      ]);

      return res.status(200).json({
        gifts,
        total,
        page: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      });
    }

    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('[GIFTS_API]', error);
    res.status(500).json({ message: 'Server error', error });
  }
}
