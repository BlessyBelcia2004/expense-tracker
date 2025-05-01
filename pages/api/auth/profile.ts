import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // your NextAuth.js configuration
import prisma from "@/lib/prisma"; // Assuming you are using Prisma for DB access

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch user data and expenses from the database
  try {
    const userProfile = await prisma.user.findUnique({
      where: { email: session.user?.email },
      select: {
        id: true,
        name: true,
        email: true,
        expenses: {
          select: {
            category: true,
            amount: true,
            date: true,
          },
        },
      },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(userProfile); // Send the profile data back to the frontend
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
