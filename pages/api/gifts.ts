import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const gifts = await prisma.gift.findMany();
    res.status(200).json(gifts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
