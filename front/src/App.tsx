import type { FC } from "react"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import Feed from "./pages/Feed"
import Login from "./pages/Login"
import NavBar from "./components/Navbar"
import "./App.css"
import NotFound from "./pages/NotFound"
import Footer from "./components/Footer"

const App: FC = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
