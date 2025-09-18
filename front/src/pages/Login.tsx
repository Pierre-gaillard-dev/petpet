import { useState, type FC, type FormEvent } from "react"
import "./Login.css"
import api from "../config/axios"
import { useNavigate } from "react-router"
import { useUser } from "../contexts/user.context"

interface PasswordRule {
  number: number
  regex: RegExp
  message: string
  color: string
}

const passwordRules: PasswordRule[] = [
  {
    number: 1,
    regex: /^.{8,}$/,
    message: "Au moins 8 caractères",
    color: "danger",
  },
  {
    number: 2,
    regex: /[A-Z]/,
    message: "Au moins une majuscule",
    color: "danger",
  },
  {
    number: 3,
    regex: /[0-9]/,
    message: "Au moins un chiffre",
    color: "warning",
  },
  {
    number: 4,
    regex: /[!@#$%^&*(),.?":{}|<>_\-=/\\[\]~`';]/,
    message: "Au moins un caractère spécial",
    color: "warning",
  },
]

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Login: FC = () => {
  const { handleLogin: saveUser } = useUser()

  const [shownSide, setShownSide] = useState<"login" | "register">("register")

  const [errorValue, setErrorValue] = useState("")

  const [passwordError, setPasswordError] = useState<PasswordRule | null>(null)
  const [emailError, setEmailError] = useState<boolean>(false)

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const navigate = useNavigate()

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      })

      if (response.status === 200) {
        saveUser?.(response.data.user)
        navigate("/")
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        setErrorValue("Mauvais email ou mot de passe")
      } else {
        console.error("Erreur inattendue :", error)
        setErrorValue("Une erreur est survenue")
      }
    }
  }

  const checkEmailValidity = (email: string) => {
    if (email.length === 0) {
      setEmailError(false)
      return
    }
    setEmailError(!emailRegex.test(email))
  }

  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) {
      setPasswordError(null)
      return
    }
    let valid = true
    passwordRules.forEach(rule => {
      if (!rule.regex.test(password)) {
        if (!valid) return
        setPasswordError(rule)
        valid = false
      }
    })
    if (valid) {
      setPasswordError(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    switch (name) {
      case "username":
        setUsername(value)
        break
      case "email":
        setEmail(value)
        checkEmailValidity(value)
        break
      case "password":
        setPassword(value)
        checkPasswordStrength(value)
        break
      case "confirmPassword":
        setConfirmPassword(value)
        break
      case "loginEmail":
        setLoginEmail(value)
        break
      case "loginPassword":
        setLoginPassword(value)
        break
      default:
        break
    }
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    const payload = { username, email, password }

    try {
      const response = await api.post("/register", payload)

      if (response.status === 200) {
        setErrorValue("")
        await loginUser(email, password)
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrorValue("Ce compte existe déjà !")
      } else {
        console.error(error)
        setErrorValue("La requête n'a pas pu aboutir")
      }
    }
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    const payload = { email: loginEmail, password: loginPassword }
    setErrorValue("")
    await loginUser(payload.email, payload.password)
  }

  const handleToggle = () => {
    setErrorValue("")
    setShownSide(shownSide === "login" ? "register" : "login")
  }

  return (
    <div className="login-page">
      <div className="login-page-card">
        <div className="register">
          <h2>S'inscrire</h2>
          <form onSubmit={handleRegister}>
            <div>
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Entrez votre nom d'utilisateur"
                className="input"
                required
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Entrez votre email"
                name="email"
                className="input"
                required
                onChange={handleInputChange}
              />
              {emailError && <span className="error">Email invalide</span>}
            </div>
            <div>
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Entrez votre mot de passe"
                className="input"
                required
                onChange={handleInputChange}
              />
              {password.length > 0 && (
                <>
                  <div className="password-requirements">
                    <div
                      className={`inner ${
                        passwordError
                          ? `error-${passwordError.number}`
                          : "success"
                      }`}
                    />
                  </div>
                  {passwordError ? passwordError.message : "Mot de passe fort"}
                </>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmez votre mot de passe"
                className="input"
                required
                onChange={handleInputChange}
              />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <span className="error">
                  Les mots de passe ne correspondent pas
                </span>
              )}
            </div>
            <button type="submit">S'inscrire</button>
            <span className="error">{errorValue}</span>
          </form>
        </div>
        <div className="login">
          <h2>Se connecter</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="loginEmail">Email</label>
              <input
                type="email"
                id="loginEmail"
                name="loginEmail"
                className="input"
                placeholder="Entrez votre email"
                required
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="loginPassword">Mot de passe</label>
              <input
                type="password"
                id="loginPassword"
                name="loginPassword"
                placeholder="Entrez votre mot de passe"
                className="input"
                required
                onChange={handleInputChange}
              />
            </div>
            <button type="submit">Se connecter</button>
            <span className="error">{errorValue}</span>
          </form>
        </div>
        <div className={`hider ${shownSide}`}>
          <div className="inner">
            <h3>
              {shownSide === "login"
                ? "Pas encore de compte ?"
                : "Déjà un compte ?"}
            </h3>
            <button onClick={handleToggle}>
              {shownSide === "login" ? "S'inscrire" : "Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
