import type { FC } from "react"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import Feed from "./pages/Feed"
import Login from "./pages/login"

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
