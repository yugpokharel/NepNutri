import { useState } from "react"

export function WaterIntake() {
  const [glasses, setGlasses] = useState(4)
  const goal = 8

  const handleAddGlass = () => {
    setGlasses((prev) => Math.min(prev + 1, goal))
  }

  return (
    <div className="water-intake">
      <div className="water-progress">
        {Array.from({ length: goal }).map((_, index) => (
          <div key={index} className={`water-glass ${index < glasses ? "filled" : ""}`}></div>
        ))}
      </div>
      <p className="water-status">
        {glasses} of {goal} glasses
      </p>
      <button className="add-water-btn" onClick={handleAddGlass}>
        Add Glass
      </button>
    </div>
  )
}

