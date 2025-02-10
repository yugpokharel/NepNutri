export function CircularProgress({ data, total, showMacros, type }) {
    const radius = 70
    const strokeWidth = 10
    const normalizedRadius = radius - strokeWidth * 2
    const circumference = normalizedRadius * 2 * Math.PI
  
    const calculateOffset = (value) => {
      const percentage = value / total
      return circumference - circumference * percentage
    }
  
    const calculateColor = (macroType) => {
      switch (macroType) {
        case "protein":
          return "#4CAF50"
        case "carbs":
          return "#2196F3"
        case "fats":
          return "#FFC107"
        default:
          return "#E91E63"
      }
    }
  
    const progressColor = type === "goal" ? "#E91E63" : "#4CAF50"
  
    return (
      <div className="circular-progress">
        <svg height={radius * 2} width={radius * 2} className="progress-ring">
          <circle
            stroke="#e0e0e0"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={progressColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + " " + circumference}
            strokeDashoffset={calculateOffset(data.total)}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="progress-circle"
          />
        </svg>
  
        <div className="progress-content">
          <span className="total-value">{data.total}</span>
          <span className="total-label">of {total}kcal</span>
        </div>
  
        {showMacros && (
          <div className="macros-list">
            <div className="macro-item" style={{ "--color": calculateColor("protein") }}>
              <span className="macro-value">{data.protein}g</span>
              <span className="macro-label">Protein</span>
            </div>
            <div className="macro-item" style={{ "--color": calculateColor("carbs") }}>
              <span className="macro-value">{data.carbs}g</span>
              <span className="macro-label">Carbs</span>
            </div>
            <div className="macro-item" style={{ "--color": calculateColor("fats") }}>
              <span className="macro-value">{data.fats}g</span>
              <span className="macro-label">Fats</span>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  