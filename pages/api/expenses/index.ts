import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface ExpenseRequest {
  name: string
  amount: string | number
  category: string
  date: string
  description?: string
  tags: string[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    try {
      const { name, amount, category, date, description, tags } = req.body as ExpenseRequest

      const expense = await prisma.expense.create({
        data: {
          name,
          amount: typeof amount === 'string' ? parseFloat(amount) : amount,
          category,
          date: new Date(date),
          description: description || null,
          tags: tags || [],
          userId: session.user.id
        },
      })

      return res.status(201).json(expense)
    } catch (error) {
      console.error('Error creating expense:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
