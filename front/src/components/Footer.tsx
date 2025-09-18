import type { FC } from "react"
import "./Footer.css"
import { Paw } from "./Icons"

const Footer: FC = () => {
  return (
    <footer className="footer">
      <div className="split">
        <a href="/" className="logo">
          <Paw />
          <h2>PetPet</h2>
        </a>
        <div className="links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
      <p>© 2024 PetPet. All rights reserved.</p>
    </footer>
  )
}

export default Footer
