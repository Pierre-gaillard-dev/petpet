import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react"
import type { Post, User } from "../types"
import api from "../config/axios"

type UserContextType = {
  user: User | null
  likedPosts: number[]
  setUser: Dispatch<SetStateAction<User | null>>
  handleLogout: () => void
  handleRegister: (newUser: User) => void
  handleLogin: (updatedUser: User) => void
  fetchLikedPosts: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  useEffect(() => {
    api
      .get("/me")
      .then(response => {
        setUser(response.data.user)
        fetchLikedPosts()
      })
      .catch(error => {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error
        )
      })
  }, [])

  const handleLogout = async () => {
    setUser(null)
    localStorage.removeItem("user")
    await api.post("/signout")
  }

  const handleRegister = (newUser: User) => {
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const handleLogin = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
    fetchLikedPosts()
  }

  const fetchLikedPosts = async () => {
    try {
      const response = await api.get("/user/likedPosts")
      setLikedPosts(response.data.posts.map((post: Post) => post.id))
    } catch (error) {
      console.error("Error fetching liked posts:", error)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        likedPosts,
        setUser,
        handleLogout,
        handleRegister,
        handleLogin,
        fetchLikedPosts,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
