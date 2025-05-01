import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // In a real app, you would verify the user's session
  // const session = await getServerSession(req, res, authOptions)
  // if (!session) {
  //   return res.status(401).json({ message: 'Unauthorized' })
  // }

  // For demo purposes, we'll use a hardcoded user ID
  const userId = "demo-user-id"

  if (req.method === "GET") {
    try {
      const recurringExpenses = await prisma.recurringExpense.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return res.status(200).json(recurringExpenses)
    } catch (error) {
      console.error("Error fetching recurring expenses:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "POST") {
    try {
      const { name, amount, category, description, frequency, startDate, endDate, isActive } = req.body

      // Validate input
      if (!name || !amount || !category || !frequency || !startDate) {
        return res.status(400).json({ message: "Missing required fields" })
      }

      const recurringExpense = await prisma.recurringExpense.create({
        data: {
          name,
          amount: Number.parseFloat(amount),
          category,
          description,
          frequency,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          isActive: isActive || true,
          userId,
        },
      })

      return res.status(201).json(recurringExpense)
    } catch (error) {
      console.error("Error creating recurring expense:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" })
  }
}
