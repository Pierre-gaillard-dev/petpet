import type { FC } from "react"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import Feed from "./pages/Feed"
import Login from "./pages/Login"
import NavBar from "./components/Navbar"
import "./App.css"
import NotFound from "./pages/NotFound"
import Footer from "./components/Footer"
import Background from "./components/Background"

const App: FC = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Background />
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
