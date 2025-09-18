import { useRef, useState, type FC } from "react"
import { Paw } from "./Icons"
import "./Background.css"

const AMOUNT_FOR_100PX = 50

const Background: FC = () => {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const [amount, setAmount] = useState(30)

  useRef(() => {
    if (backgroundRef.current) {
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          const height = entry.contentRect.height
          const width = entry.contentRect.width
          setAmount(
            Math.floor(((height * width) / (100 * 100)) * AMOUNT_FOR_100PX)
          )
        }
      })
      observer.observe(backgroundRef.current)
      return () => observer.disconnect()
    }
  })

  return (
    <div className="background" ref={backgroundRef}>
      {Array.from({ length: amount }).map((_, index) => {
        const positionX = Math.random() * 100
        const positionY = Math.random() * 100
        const size = Math.random() * 50 + 20
        const opacity = Math.random() * 0.5 + 0.2
        const rotation = Math.random() * 360
        return (
          <Paw
            key={index}
            style={{
              position: "absolute",
              left: `${positionX}%`,
              top: `${positionY}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              transform: `rotate(${rotation}deg)`,
            }}
          />
        )
      })}
    </div>
  )
}

export default Background
