import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { name, email, password } = req.body;

      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashed },
      });

      return res.status(201).json(user);
    }

    if (req.method === 'GET') {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ message: 'userId required' });

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: { orders: true },
      });

      return res.status(200).json(user);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
}
