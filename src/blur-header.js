import { useState, useEffect } from "react"
import "./blur-header.css"

function BlurSection({ children }) {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const blurAmount = Math.min(scrollPosition / 500, 0.1)

  return (
    <div
      className="blur-section"
      style={{
        "--blur-amount": blurAmount,
      }}
    >
      {children}
    </div>
  )
}

export default BlurSection

