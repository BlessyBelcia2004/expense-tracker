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
      const goal = await prisma.goal.findFirst({
        where: {
          id,
          userId,
        },
      })

      if (!goal) {
        return res.status(404).json({ message: "Goal not found" })
      }

      return res.status(200).json(goal)
    } catch (error) {
      console.error("Error fetching goal:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "PUT") {
    try {
      const { name, targetAmount, currentAmount, targetDate, category, description } = req.body

      // Validate input
      if (!name || !targetAmount || !targetDate || !category) {
        return res.status(400).json({ message: "Missing required fields" })
      }

      // Check if goal exists and belongs to user
      const existingGoal = await prisma.goal.findFirst({
        where: {
          id,
          userId,
        },
      })

      if (!existingGoal) {
        return res.status(404).json({ message: "Goal not found" })
      }

      const updatedGoal = await prisma.goal.update({
        where: {
          id,
        },
        data: {
          name,
          targetAmount: Number.parseFloat(targetAmount),
          currentAmount: currentAmount ? Number.parseFloat(currentAmount) : 0,
          targetDate: new Date(targetDate),
          category,
          description,
          isCompleted: Number.parseFloat(currentAmount) >= Number.parseFloat(targetAmount),
        },
      })

      return res.status(200).json(updatedGoal)
    } catch (error) {
      console.error("Error updating goal:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "DELETE") {
    try {
      // Check if goal exists and belongs to user
      const existingGoal = await prisma.goal.findFirst({
        where: {
          id,
          userId,
        },
      })

      if (!existingGoal) {
        return res.status(404).json({ message: "Goal not found" })
      }

      await prisma.goal.delete({
        where: {
          id,
        },
      })

      return res.status(200).json({ message: "Goal deleted successfully" })
    } catch (error) {
      console.error("Error deleting goal:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" })
  }
}
