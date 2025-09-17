import { useState, type FC } from "react"
import { Bell, Paw, Plus, Profile } from "./Icons"
import "./NavBar.css"
import AddPostModal from "./AddPostModal"
import Popover from "./Popover"
import { useUser } from "../contexts/user.context"
import { Link } from "react-router"

const Navbar: FC = () => {
  const { user, handleLogout } = useUser()

  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  const handleAddModalClose = () => {
    setIsAddModalOpen(false)
  }

  const handleNotifClick = () => {
    // Logic to open the notifications panel goes here
    console.log("Notifications button clicked")
  }

  const handleProfileClick = () => {
    if (user) {
      setIsUserPopoverOpen(prev => !prev)
    }
  }

  const handleProfilePopoverClose = () => {
    setIsUserPopoverOpen(false)
  }

  const handleLogoutClick = () => {
    if (handleLogout) {
      handleLogout()
    }
    setIsUserPopoverOpen(false)
  }

  return (
    <>
      <div className="navbar">
        <Link className="logo" to="/">
          PetPet
          <Paw />
        </Link>
        <div className="nav-links">
          <a onClick={handleAddClick}>
            <Plus />
            Ajouter
          </a>
          <a onClick={handleNotifClick}>
            <Bell />
          </a>
          <div className="profile">
            <Link onClick={handleProfileClick} to={user ? "" : "/login"}>
              <Profile />
              {user ? user.username : "Profil"}
            </Link>
            <Popover
              isOpen={isUserPopoverOpen}
              onClose={handleProfilePopoverClose}
            >
              <a onClick={handleLogoutClick}>Se déconnecter</a>
            </Popover>
          </div>
        </div>
      </div>

      <AddPostModal isOpen={isAddModalOpen} onClose={handleAddModalClose} />
    </>
  )
}

export default Navbar
