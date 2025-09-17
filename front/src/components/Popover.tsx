import { useEffect, type FC } from "react"
import "./Popover.css"

interface PopoverProps {
  isOpen?: boolean
  onClose?: () => void
  children: React.ReactNode
}

const Popover: FC<PopoverProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen && onClose) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  return <div className={`popover ${isOpen ? "open" : ""}`}>{children}</div>
}

export default Popover
