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
  const { id } = req.query

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" })
  }

  if (req.method === "GET") {
    try {
      const recurringExpense = await prisma.recurringExpense.findFirst({
        where: {
          id,
          userId,
        },
      })

      if (!recurringExpense) {
        return res.status(404).json({ message: "Recurring expense not found" })
      }

      return res.status(200).json(recurringExpense)
    } catch (error) {
      console.error("Error fetching recurring expense:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "PUT") {
    try {
      const { name, amount, category, description, frequency, startDate, endDate, isActive } = req.body

      // Validate input
      if (!name || !amount || !category || !frequency || !startDate) {
        return res.status(400).json({ message: "Missing required fields" })
      }

      // Check if recurring expense exists and belongs to user
      const existingExpense = await prisma.recurringExpense.findFirst({
        where: {
          id,
          userId,
        },
      })

      if (!existingExpense) {
        return res.status(404).json({ message: "Recurring expense not found" })
      }

      const updatedExpense = await prisma.recurringExpense.update({
        where: {
          id,
        },
        data: {
          name,
          amount: Number.parseFloat(amount),
          category,
          description,
          frequency,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          isActive: isActive || true,
        },
      })

      return res.status(200).json(updatedExpense)
    } catch (error) {
      console.error("Error updating recurring expense:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "DELETE") {
    try {
      // Check if recurring expense exists and belongs to user
      const existingExpense = await prisma.recurringExpense.findFirst({
        where: {
          id,
          userId,
        },
      })

      if (!existingExpense) {
        return res.status(404).json({ message: "Recurring expense not found" })
      }

      await prisma.recurringExpense.delete({
        where: {
          id,
        },
      })

      return res.status(200).json({ message: "Recurring expense deleted successfully" })
    } catch (error) {
      console.error("Error deleting recurring expense:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" })
  }
}
