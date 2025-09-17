interface UserShort {
  id: number
  username: string
}

interface User extends UserShort {
  email: string
  createdAt: string
  updatedAt: string
}

export type { UserShort, User }
