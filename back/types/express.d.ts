import { Post } from "@prisma/client"

declare global {
  namespace Express {
    interface Request {
      userSession?: {
        id: number
        username: string
        iat: number
        exp: number
      }
      post?: Post
    }
  }
}

export {}
