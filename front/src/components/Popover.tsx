import { useEffect, useRef, type FC } from "react"
import "./Popover.css"

export interface PopoverProps {
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const Popover: FC<PopoverProps> = ({ isOpen, onClose, children }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        onClose &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={popoverRef} className={`popover ${isOpen ? "open" : ""}`}>
      {children}
    </div>
  );
};

export default Popover;
