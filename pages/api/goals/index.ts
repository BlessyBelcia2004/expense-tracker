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
      const goals = await prisma.goal.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return res.status(200).json(goals)
    } catch (error) {
      console.error("Error fetching goals:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "POST") {
    try {
      const { name, targetAmount, currentAmount, targetDate, category, description } = req.body

      // Validate input
      if (!name || !targetAmount || !targetDate || !category) {
        return res.status(400).json({ message: "Missing required fields" })
      }

      const goal = await prisma.goal.create({
        data: {
          name,
          targetAmount: Number.parseFloat(targetAmount),
          currentAmount: currentAmount ? Number.parseFloat(currentAmount) : 0,
          targetDate: new Date(targetDate),
          category,
          description,
          isCompleted: Number.parseFloat(currentAmount) >= Number.parseFloat(targetAmount),
          userId,
        },
      })

      return res.status(201).json(goal)
    } catch (error) {
      console.error("Error creating goal:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" })
  }
}
