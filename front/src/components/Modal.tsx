import type { FC, ReactNode } from "react"
import "./Modal.css"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-content ${className}`}
        onClick={e => e.stopPropagation()}
      >
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Modal
export type { ModalProps }
