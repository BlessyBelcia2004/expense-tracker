import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import  prisma  from '@/lib/prisma'; // use your Prisma singleton client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return handleSignup(req, res);
  }

  if (req.method === 'DELETE') {
    return handleDeleteUser(req, res);
  }

  return res.status(405).json({ success: false, message: 'Method not allowed.' });
}

const handleSignup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', (error as Error).message);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const handleDeleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required to delete a user.' });
  }

  try {
    const deletedUser = await prisma.user.delete({ where: { email } });

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
      deletedUser: {
        id: deletedUser.id,
        email: deletedUser.email,
      },
    });
  } catch (error) {
    console.error('Delete error:', (error as Error).message);
    return res.status(500).json({ success: false, message: 'Could not delete user.' });
  }
};