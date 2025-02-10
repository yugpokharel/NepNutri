import { useState } from "react"
import "./dashboard.css"
import { CircularProgress } from "./CircularProgress"
import { DashboardHeader } from "./DashboardHeader"
import { Navigation } from "./Navigation"
import { RecentMeals } from "./RecentMeals"
import { WaterIntake } from "./WaterIntake"

export default function Dashboard() {
  const [goalData] = useState({
    total: 2100,
    protein: 185,
    carbs: 225,
    fats: 83,
  })

  const [todayData] = useState({
    total: 1450,
    protein: 120,
    carbs: 180,
    fats: 55,
  })

  return (
    <div className="dashboard">
      <DashboardHeader username="yugdal" />
      <Navigation />

      <main className="dashboard-content">
        <h1 className="dashboard-title">Your Nutrition Dashboard</h1>
        <div className="dashboard-grid">
          <div className="progress-card">
            <h2 className="card-title">Daily Goal</h2>
            <CircularProgress data={goalData} total={goalData.total} showMacros={true} type="goal" />
          </div>

          <div className="progress-card">
            <h2 className="card-title">Today's Progress</h2>
            <CircularProgress data={todayData} total={goalData.total} showMacros={true} type="progress" />
            <button className="log-food-btn">Log Food</button>
          </div>

          <div className="recent-meals-card">
            <h2 className="card-title">Recent Meals</h2>
            <RecentMeals />
          </div>

          <div className="water-intake-card">
            <h2 className="card-title">Water Intake</h2>
            <WaterIntake />
          </div>
        </div>
      </main>
    </div>
  )
}

