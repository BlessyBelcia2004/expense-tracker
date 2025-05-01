import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import { startOfMonth, endOfMonth, format, eachMonthOfInterval } from "date-fns"

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
      const { startDate, endDate, category, reportType } = req.query

      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" })
      }

      const start = new Date(startDate as string)
      const end = new Date(endDate as string)

      // Get all expenses within date range
      const expenses = await prisma.expense.findMany({
        where: {
          userId,
          date: {
            gte: start,
            lte: end,
          },
          ...(category && category !== "all" ? { category: category as string } : {}),
        },
        orderBy: {
          date: "asc",
        },
      })

      // Process data based on report type
      let reportData = {}

      if (reportType === "categories" || reportType === "overview") {
        // Group expenses by category
        interface CategoryAccumulator {
          [key: string]: number;
        }

        const categoryData = expenses.reduce((acc: CategoryAccumulator, expense) => {
          if (!acc[expense.category]) {
            acc[expense.category] = 0
          }
          acc[expense.category] += expense.amount
          return acc
        }, {} as CategoryAccumulator)

        reportData = {
          ...reportData,
          categoryData: Object.entries(categoryData).map(([name, value]) => ({
            name,
            value,
          })),
        }
      }

      if (reportType === "trends" || reportType === "overview") {
        // Group expenses by month
        const months = eachMonthOfInterval({ start, end })

        const monthlyData = months.map((month) => {
          const monthStart = startOfMonth(month)
          const monthEnd = endOfMonth(month)
          const monthName = format(month, "MMM yyyy")

          const monthExpenses = expenses.filter((expense) => expense.date >= monthStart && expense.date <= monthEnd)

          const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

          return {
            name: monthName,
            expenses: totalAmount,
            // In a real app, you would fetch income data from another table
            income: 0,
            savings: 0,
          }
        })

        reportData = {
          ...reportData,
          trendData: monthlyData,
        }
      }

      return res.status(200).json(reportData)
    } catch (error) {
      console.error("Error generating report:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" })
  }
}
