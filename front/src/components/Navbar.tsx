import type { FC } from "react"
import { Bell, Paw, Plus } from "./Icons"
import "./NavBar.css"

const Navbar: FC = () => {
  const handleAddClick = () => {
    // Logic to open the add pet modal goes here
    console.log("Add Pet button clicked")
  }

  const handleNotifClick = () => {
    // Logic to open the notifications panel goes here
    console.log("Notifications button clicked")
  }

  const handleProfileClick = () => {
    // Logic to navigate to the user profile goes here
    console.log("Profile button clicked")
  }
  return (
    <div className="navbar">
      <div className="logo">
        PetPet
        <Paw />
      </div>
      <div className="nav-links">
        <a onClick={handleAddClick}>
          <Plus />
          Ajouter
        </a>
        <a onClick={handleNotifClick}>
          <Bell />
        </a>
        <a onClick={handleProfileClick}>Profil</a>
      </div>
    </div>
  )
}

export default Navbar
