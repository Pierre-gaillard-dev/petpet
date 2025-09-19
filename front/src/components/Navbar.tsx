import { useEffect, useRef, useState, type FC } from "react"
import { Bell, Paw, Plus, Profile } from "./Icons"
import "./NavBar.css"
import AddPostModal from "./AddPostModal"
import Popover from "./Popover"
import { useUser } from "../contexts/user.context"
import { Link } from "react-router"
import NotificationPopover from "./NotificationPopover"

const Navbar: FC = () => {
  const { user, handleLogout } = useUser()

  const navbarRef = useRef<HTMLDivElement>(null)
  const windowScrollY = useRef(window.scrollY)

  const [distanceFromTop, setDistanceFromTop] = useState(0)

  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isNotifPopoverOpen, setIsNotifPopoverOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        const currentScrollY = window.scrollY
        setDistanceFromTop(prev =>
          Math.min(
            Math.max(prev + currentScrollY - windowScrollY.current, 0),
            navbarRef.current!.offsetHeight
          )
        )
        windowScrollY.current = currentScrollY
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  const handleAddModalClose = () => {
    setIsAddModalOpen(false)
  }

  const handleNotifClick = () => {
    setIsNotifPopoverOpen(prev => !prev)
  }

  const handleNotifPopoverClose = () => {
    setIsNotifPopoverOpen(false)
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
    <section className="navbar-container">
      <div
        className={`navbar`}
        ref={navbarRef}
        style={{ top: -distanceFromTop }}
      >
        <Link className="logo" to="/">
          PetPet
          <Paw />
        </Link>
        <div className="nav-links">
          {user && (
            <>
              <a onClick={handleAddClick}>
                <Plus />
                Ajouter
              </a>
              <a onClick={handleNotifClick}>
                <Bell />
                <NotificationPopover
                  isOpen={isNotifPopoverOpen}
                  onClose={handleNotifPopoverClose}
                />
              </a>
            </>
          )}
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
    </section>
  )
}

export default Navbar
