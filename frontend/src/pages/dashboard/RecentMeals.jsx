export function RecentMeals() {
    const meals = [
      { name: "Breakfast", calories: 450, time: "8:30 AM" },
      { name: "Lunch", calories: 650, time: "12:45 PM" },
      { name: "Snack", calories: 200, time: "3:15 PM" },
    ]
  
    return (
      <div className="recent-meals">
        {meals.map((meal, index) => (
          <div key={index} className="meal-item">
            <div className="meal-info">
              <span className="meal-name">{meal.name}</span>
              <span className="meal-time">{meal.time}</span>
            </div>
            <span className="meal-calories">{meal.calories} kcal</span>
          </div>
        ))}
      </div>
    )
  }
  
  