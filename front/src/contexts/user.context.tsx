import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react"
import type { User } from "../types"
import api from "../config/axios"

type UserContextType = {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  handleLogout?: () => void
  handleRegister?: (newUser: User) => void
  handleLogin?: (updatedUser: User) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    api
      .get("/me")
      .then(response => {
        setUser(response.data)
      })
      .catch(error => {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error
        )
      })
  }, [])

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const handleRegister = (newUser: User) => {
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const handleLogin = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, handleLogout, handleRegister, handleLogin }}
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
