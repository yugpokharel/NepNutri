"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"

import {
  Settings,
  HelpCircle,
  Instagram,
  Twitter,
  LogOut,
  Plus,
  TrendingUp,
  Utensils,
  BarChart3,
  Activity,
} from "lucide-react"
import "./dashboard.css"

// Unique class prefix for this component
const classPrefix = "dash-nutritrack-XpL7mDvR2qF9sAeB3yTz"

// Constants
const DEFAULT_CALORIE_LIMIT = 2000
const KCAL_PER_GRAM = { protein: 4, fat: 9, carbs: 4 }

// Helper Functions
const calculateMacroCalories = (grams, kcalPerGram) => grams * kcalPerGram

export default function DashboardPage() {
  const [userData, setUserData] = useState(null)
  const [calories, setCalories] = useState(null)
  const [macros, setMacros] = useState(null)
  const [todayCalories, setTodayCalories] = useState(0)
  const [todayMacros, setTodayMacros] = useState({ protein: 0, fat: 0, carbs: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchUserData = useCallback(async () => {
    try {
      const userEmail = JSON.parse(localStorage.getItem("user"))?.email
      if (!userEmail) throw new Error("No user email found")

      const response = await axios.post(
        "http://localhost:5001/users/calculate",
        { email: userEmail },
        { withCredentials: true },
      )

      setCalories(response.data?.data?.calories)
      setMacros(response.data?.data?.macros)
      setUserData(response.data?.user || { firstName: "User" })

      const todayData = JSON.parse(localStorage.getItem("todayFood")) || {}
      setTodayCalories(todayData.calories || todayData?.macros?.calories || 0)
      setTodayMacros({
        protein: todayData?.macros?.protein || todayData.protein || 0,
        fat: todayData?.macros?.fat || todayData.fat || 0,
        carbs: todayData?.macros?.carbs || todayData.carbs || 0,
      })

      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      setLoading(false)

      const todayData = JSON.parse(localStorage.getItem("todayFood")) || {}
      setTodayCalories(todayData.calories || todayData?.macros?.calories || 0)
      setTodayMacros({
        protein: todayData?.macros?.protein || todayData.protein || 0,
        fat: todayData?.macros?.fat || todayData.fat || 0,
        carbs: todayData?.macros?.carbs || todayData.carbs || 0,
      })
    }
  }, [])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const handleLogout = useCallback(() => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = "/login"
  }, [])

  const username = JSON.parse(localStorage.getItem("user"))?.firstName || "User"

  // Calculate calorie contributions for each macro (for reference, though not displayed)
  const { proteinCalories, fatCalories, carbCalories, totalTodayCalories } = useMemo(() => {
    const proteinCalories = calculateMacroCalories(todayMacros.protein, KCAL_PER_GRAM.protein)
    const fatCalories = calculateMacroCalories(todayMacros.fat, KCAL_PER_GRAM.fat)
    const carbCalories = calculateMacroCalories(todayMacros.carbs, KCAL_PER_GRAM.carbs)
    const totalTodayCalories = proteinCalories + fatCalories + carbCalories

    return { proteinCalories, fatCalories, carbCalories, totalTodayCalories }
  }, [todayMacros])

  // Calculate the percentage of today's calories toward the calorie limit
  const todayCaloriePercentage = useMemo(() => {
    const calorieLimit = calories || DEFAULT_CALORIE_LIMIT
    return (todayCalories / calorieLimit) * 100 || 0
  }, [todayCalories, calories])

  return (
    <div className={`${classPrefix}-dashboard`}>
      <header className={`${classPrefix}-header`}>
        <div className={`${classPrefix}-header-content`}>
          <div className={`${classPrefix}-logo-container`} onClick={() => navigate("/homepage")}>
            <img src={logo || "/placeholder.svg"} alt="NutriTrack" className={`${classPrefix}-logo-image`} />
            <span className={`${classPrefix}-logo-text`}>NepNutri</span>
          </div>

          <div className={`${classPrefix}-header-right`}>
            <div className={`${classPrefix}-greeting`}>
              Hi, <span className={`${classPrefix}-username`}>{username}</span>
            </div>

            <div className={`${classPrefix}-header-actions`}>
              <button className={`${classPrefix}-icon-button`} aria-label="Settings">
                <Settings size={18} />
              </button>
              <button className={`${classPrefix}-icon-button`} aria-label="Help">
                <HelpCircle size={18} />
              </button>
              <button onClick={handleLogout} className={`${classPrefix}-logout-button`}>
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
              <div className={`${classPrefix}-social-links`}>
                <a href="#" className={`${classPrefix}-social-link`} aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="#" className={`${classPrefix}-social-link`} aria-label="Twitter">
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={`${classPrefix}-main-content`}>
        <div className={`${classPrefix}-page-header`}>
          <h1 className={`${classPrefix}-page-title`}>Your Dashboard</h1>
          <p className={`${classPrefix}-page-subtitle`}>Track your nutrition goals and daily progress</p>
        </div>

        <div className={`${classPrefix}-cards-container`}>
          <div className={`${classPrefix}-card ${classPrefix}-goals-card`}>
            <GoalsCard loading={loading} calories={calories} macros={macros} classPrefix={classPrefix} />
          </div>
          <div className={`${classPrefix}-card ${classPrefix}-today-card`}>
            <TodayCard
              todayCalories={todayCalories}
              todayMacros={todayMacros}
              calorieLimit={calories || DEFAULT_CALORIE_LIMIT}
              todayCaloriePercentage={todayCaloriePercentage}
              macros={macros}
              classPrefix={classPrefix}
            />
          </div>
        </div>

        <div className={`${classPrefix}-quick-actions`}>
          <button className={`${classPrefix}-action-button`} onClick={() => (window.location.href = "/break")}>
            <Utensils size={18} />
            <span>Log Meal</span>
          </button>
          <button className={`${classPrefix}-action-button`}>
            <BarChart3 size={18} />
            <span>View Reports</span>
          </button>
          <button className={`${classPrefix}-action-button`}>
            <Activity size={18} />
            <span>Log Exercise</span>
          </button>
        </div>
      </main>
    </div>
  )
}

const GoalsCard = ({ loading, calories, macros, classPrefix }) => (
  <div className={`${classPrefix}-card ${classPrefix}-goals-card`}>
    <div className={`${classPrefix}-card-header`}>
      <h2 className={`${classPrefix}-card-title`}>
        <TrendingUp size={18} />
        Your Nutrition Goals
      </h2>
    </div>

    {loading ? (
      <div className={`${classPrefix}-loading-container`}>
        <div className={`${classPrefix}-loading-spinner`}></div>
        <p>Loading your goals...</p>
      </div>
    ) : (
      <div className={`${classPrefix}-goals-content`}>
        <div className={`${classPrefix}-circle-progress ${classPrefix}-goals`}>
          <div className={`${classPrefix}-circle-inner`}>
            <span className={`${classPrefix}-value`}>{calories || 0}</span>
            <span className={`${classPrefix}-label`}>kcal</span>
          </div>
          <svg className={`${classPrefix}-progress-ring`} width="160" height="160" viewBox="0 0 160 160">
            <circle
              className={`${classPrefix}-progress-ring-circle-bg`}
              stroke="#f3f4f6"
              strokeWidth="10"
              fill="transparent"
              r="70"
              cx="80"
              cy="80"
            />
            <circle
              className={`${classPrefix}-progress-ring-circle`}
              stroke="#10b981"
              strokeWidth="10"
              fill="transparent"
              r="70"
              cx="80"
              cy="80"
              strokeDasharray="439.8"
              strokeDashoffset="110"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className={`${classPrefix}-macros-container`}>
          <h3 className={`${classPrefix}-macros-title`}>Daily Macronutrients</h3>
          <div className={`${classPrefix}-macros`}>
            <div className={`${classPrefix}-macro-item ${classPrefix}-protein-item`}>
              <span className={`${classPrefix}-dot ${classPrefix}-protein`}></span>
              <div className={`${classPrefix}-macro-info`}>
                <span className={`${classPrefix}-macro-value`}>{macros?.protein || 0}g</span>
                <span className={`${classPrefix}-macro-label`}>Protein</span>
              </div>
              <div className={`${classPrefix}-macro-bar-container`}>
                <div className={`${classPrefix}-macro-bar ${classPrefix}-protein-bar`} style={{ width: "75%" }}></div>
              </div>
            </div>

            <div className={`${classPrefix}-macro-item ${classPrefix}-carbs-item`}>
              <span className={`${classPrefix}-dot ${classPrefix}-carbs`}></span>
              <div className={`${classPrefix}-macro-info`}>
                <span className={`${classPrefix}-macro-value`}>{macros?.carbs || 0}g</span>
                <span className={`${classPrefix}-macro-label`}>Carbs</span>
              </div>
              <div className={`${classPrefix}-macro-bar-container`}>
                <div className={`${classPrefix}-macro-bar ${classPrefix}-carbs-bar`} style={{ width: "60%" }}></div>
              </div>
            </div>

            <div className={`${classPrefix}-macro-item ${classPrefix}-fat-item`}>
              <span className={`${classPrefix}-dot ${classPrefix}-fat`}></span>
              <div className={`${classPrefix}-macro-info`}>
                <span className={`${classPrefix}-macro-value`}>{macros?.fats || 0}g</span>
                <span className={`${classPrefix}-macro-label`}>Fat</span>
              </div>
              <div className={`${classPrefix}-macro-bar-container`}>
                <div className={`${classPrefix}-macro-bar ${classPrefix}-fat-bar`} style={{ width: "40%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)

const TodayCard = ({ todayCalories, todayMacros, calorieLimit, todayCaloriePercentage, classPrefix, macros }) => (
  <div className={`${classPrefix}-card ${classPrefix}-today-card`}>
    <div className={`${classPrefix}-card-header`}>
      <h2 className={`${classPrefix}-card-title`}>
        <Activity size={18} />
        Today's Progress
      </h2>
    </div>

    <div className={`${classPrefix}-today-content`}>
      {todayCalories === 0 ? (
        <div className={`${classPrefix}-empty-state`}>
          <div className={`${classPrefix}-empty-icon`}>🍽️</div>
          <p className={`${classPrefix}-empty-text`}>You haven't logged any food yet today</p>
          <button className={`${classPrefix}-log-food-btn`} onClick={() => (window.location.href = "/break")}>
            <Plus size={16} />
            Log Food
          </button>
        </div>
      ) : (
        <div className={`${classPrefix}-progress-content`}>
          <div className={`${classPrefix}-circle-container`}>
            <div className={`${classPrefix}-circle-progress ${classPrefix}-today`}>
              <div className={`${classPrefix}-circle-inner`}>
                <span className={`${classPrefix}-value`}>{todayCalories}</span>
                <span className={`${classPrefix}-label`}>kcal</span>
              </div>
              <svg className={`${classPrefix}-progress-ring`} width="160" height="160" viewBox="0 0 160 160">
                <circle
                  className={`${classPrefix}-progress-ring-circle-bg`}
                  stroke="#f3f4f6"
                  strokeWidth="10"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                />
                <circle
                  className={`${classPrefix}-progress-ring-circle`}
                  stroke="#10b981"
                  strokeWidth="10"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                  strokeDasharray="439.8"
                  strokeDashoffset={439.8 - (todayCaloriePercentage / 100) * 439.8}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className={`${classPrefix}-progress-text`}>
              <span className={`${classPrefix}-progress-percentage`}>{Math.round(todayCaloriePercentage)}%</span> of{" "}
              {calorieLimit} kcal goal
            </p>
          </div>

          <div className={`${classPrefix}-macros-summary`}>
            <h3 className={`${classPrefix}-macros-title`}>Macros Consumed</h3>
            <div className={`${classPrefix}-macros`}>
              <div className={`${classPrefix}-macro-item ${classPrefix}-protein-item`}>
                <span className={`${classPrefix}-dot ${classPrefix}-protein`}></span>
                <div className={`${classPrefix}-macro-info`}>
                  <span className={`${classPrefix}-macro-value`}>{todayMacros.protein}g</span>
                  <span className={`${classPrefix}-macro-label`}>Protein</span>
                </div>
                <div className={`${classPrefix}-macro-bar-container`}>
                  <div
                    className={`${classPrefix}-macro-bar ${classPrefix}-protein-bar`}
                    style={{ width: `${(todayMacros.protein / (macros?.protein || 100)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className={`${classPrefix}-macro-item ${classPrefix}-carbs-item`}>
                <span className={`${classPrefix}-dot ${classPrefix}-carbs`}></span>
                <div className={`${classPrefix}-macro-info`}>
                  <span className={`${classPrefix}-macro-value`}>{todayMacros.carbs}g</span>
                  <span className={`${classPrefix}-macro-label`}>Carbs</span>
                </div>
                <div className={`${classPrefix}-macro-bar-container`}>
                  <div
                    className={`${classPrefix}-macro-bar ${classPrefix}-carbs-bar`}
                    style={{ width: `${(todayMacros.carbs / (macros?.carbs || 100)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className={`${classPrefix}-macro-item ${classPrefix}-fat-item`}>
                <span className={`${classPrefix}-dot ${classPrefix}-fat`}></span>
                <div className={`${classPrefix}-macro-info`}>
                  <span className={`${classPrefix}-macro-value`}>{todayMacros.fat}g</span>
                  <span className={`${classPrefix}-macro-label`}>Fat</span>
                </div>
                <div className={`${classPrefix}-macro-bar-container`}>
                  <div
                    className={`${classPrefix}-macro-bar ${classPrefix}-fat-bar`}
                    style={{ width: `${(todayMacros.fat / (macros?.fats || 100)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <button className={`${classPrefix}-log-food-btn`} onClick={() => (window.location.href = "/break")}>
            <Plus size={16} />
            Add More Food
          </button>
        </div>
      )}
    </div>
  </div>
)

