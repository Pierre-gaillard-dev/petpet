import type { FC } from "react"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import Feed from "./pages/Feed"
import Login from "./pages/Login"
import NavBar from "./components/Navbar"
import "./App.css"

const App: FC = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
