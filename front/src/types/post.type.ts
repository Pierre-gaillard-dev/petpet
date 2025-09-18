import type { UserShort } from "./user.type"

interface Post {
  id: number
  image_path: string
  description: string
  user: UserShort
  like?: number
  createdAt: string
  updatedAt: string
}

export type { Post }
