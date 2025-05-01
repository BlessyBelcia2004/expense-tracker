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
      const { month, year } = req.query

      const budgets = await prisma.budget.findMany({
        where: {
          userId,
          ...(month && year ? { month: Number(month), year: Number(year) } : {}),
        },
      })

      return res.status(200).json(budgets)
    } catch (error) {
      console.error("Error fetching budgets:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "POST") {
    try {
      const { month, year, category, amount } = req.body

      // Validate input
      if (!month || !year || !category || !amount) {
        return res.status(400).json({ message: "Missing required fields" })
      }

      // Check if budget already exists for this month, year, and category
      const existingBudget = await prisma.budget.findFirst({
        where: {
          userId,
          month: Number(month),
          year: Number(year),
          category,
        },
      })

      let budget

      if (existingBudget) {
        // Update existing budget
        budget = await prisma.budget.update({
          where: {
            id: existingBudget.id,
          },
          data: {
            amount: Number.parseFloat(amount),
          },
        })
      } else {
        // Create new budget
        budget = await prisma.budget.create({
          data: {
            month: Number(month),
            year: Number(year),
            category,
            amount: Number.parseFloat(amount),
            userId,
          },
        })
      }

      return res.status(201).json(budget)
    } catch (error) {
      console.error("Error creating/updating budget:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" })
  }
}
