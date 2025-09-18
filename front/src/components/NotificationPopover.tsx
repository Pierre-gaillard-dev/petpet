import { useEffect, useState, type FC } from "react"
import Popover, { type PopoverProps } from "./Popover"
import type { Notification } from "../types"
import api from "../config/axios"
import "./NotificationPopover.css"

interface NotificationPopoverProps extends Omit<PopoverProps, "children"> {}

const NotificationPopover: FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        api.get("/user/notification").then(response => {
          setNotifications(response.data.notifications)
        })
      } catch (err) {
        console.log(err)
      }
    }

    fetchNotifications()
  }, [])

  return (
    <Popover isOpen={isOpen && notifications.length > 0} onClose={onClose}>
      <div className="notification-popover">
        {notifications.map(notification => (
          <div
            key={`notification-${notification.postId}-${notification.userId}`}
            className="notification-item"
          >
            <span className="notification-username">
              Vous avez reçu une demande de caresse de la part de{" "}
              {notification.username}
            </span>
          </div>
        ))}
      </div>
    </Popover>
  )
}

export default NotificationPopover
