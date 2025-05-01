import type { NextApiRequest, NextApiResponse } from "next"
import { verify } from "jsonwebtoken"

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string
    email: string
  }
}

export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Get token from authorization header
      const authHeader = req.headers.authorization

      if (!authHeader) {
        console.log("No authorization header found")
        return res.status(401).json({ message: "Unauthorized: No authorization header" })
      }

      let token

      // Handle both "Bearer token" and just "token" formats
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1]
      } else {
        token = authHeader
      }

      if (!token) {
        console.log("No token found in authorization header")
        return res.status(401).json({ message: "Unauthorized: No token provided" })
      }

      console.log("Verifying token...")

      // Verify token
      const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key") as {
        id: string
        email: string
      }

      console.log("Token verified, user ID:", decoded.id)

      // Add user to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
      }

      // Call the original handler
      return handler(req, res)
    } catch (error) {
      console.error("Authentication error:", error)
      return res.status(401).json({ message: "Unauthorized: Invalid token" })
    }
  }
}
