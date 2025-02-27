import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Settings, HelpCircle, Instagram, Twitter, LogOut, Plus } from 'lucide-react';
import "./dashboard.css";

// Constants
const DEFAULT_CALORIE_LIMIT = 2000;
const KCAL_PER_GRAM = { protein: 4, fat: 9, carbs: 4 };

// Helper Functions
const calculateMacroCalories = (grams, kcalPerGram) => grams * kcalPerGram;

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [calories, setCalories] = useState(null);
  const [macros, setMacros] = useState(null);
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayMacros, setTodayMacros] = useState({ protein: 0, fat: 0, carbs: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
      if (!userEmail) throw new Error("No user email found");

      const response = await axios.post(
        "http://localhost:5001/users/calculate",
        { email: userEmail },
        { withCredentials: true }
      );

      setCalories(response.data?.data?.calories);
      setMacros(response.data?.data?.macros);
      setUserData(response.data?.user || { firstName: "User" });

      const todayData = JSON.parse(localStorage.getItem('todayFood')) || {};
      setTodayCalories(todayData.calories || todayData?.macros?.calories || 0);
      setTodayMacros({
        protein: todayData?.macros?.protein || todayData.protein || 0,
        fat: todayData?.macros?.fat || todayData.fat || 0,
        carbs: todayData?.macros?.carbs || todayData.carbs || 0
      });

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setLoading(false);

      const todayData = JSON.parse(localStorage.getItem('todayFood')) || {};
      setTodayCalories(todayData.calories || todayData?.macros?.calories || 0);
      setTodayMacros({
        protein: todayData?.macros?.protein || todayData.protein || 0,
        fat: todayData?.macros?.fat || todayData.fat || 0,
        carbs: todayData?.macros?.carbs || todayData.carbs || 0
      });
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  }, []);

  const username = userData?.firstName || "User";

  // Calculate calorie contributions for each macro (for reference, though not displayed)
  const { proteinCalories, fatCalories, carbCalories, totalTodayCalories } = useMemo(() => {
    const proteinCalories = calculateMacroCalories(todayMacros.protein, KCAL_PER_GRAM.protein);
    const fatCalories = calculateMacroCalories(todayMacros.fat, KCAL_PER_GRAM.fat);
    const carbCalories = calculateMacroCalories(todayMacros.carbs, KCAL_PER_GRAM.carbs);
    const totalTodayCalories = proteinCalories + fatCalories + carbCalories;

    return { proteinCalories, fatCalories, carbCalories, totalTodayCalories };
  }, [todayMacros]);

  // Calculate the percentage of today's calories toward the calorie limit
  const todayCaloriePercentage = useMemo(() => {
    const calorieLimit = calories || DEFAULT_CALORIE_LIMIT;
    return (todayCalories / calorieLimit) * 100 || 0;
  }, [todayCalories, calories]);

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <div className="logo-container" onClick={() => navigate("/homepage")}>
            <img src={logo || "/placeholder.svg"} alt="NutriTrack" className="logo-image" />
            <span className="logo-text">NutriTrack</span>
          </div>
          
          <div className="header-right">
            <div className="greeting">
              Hi, <span className="username">{username}</span>
            </div>
            
            <div className="header-actions">
              <button className="icon-button" aria-label="Settings">
                <Settings size={18} />
              </button>
              <button className="icon-button" aria-label="Help">
                <HelpCircle size={18} />
              </button>
              <button onClick={handleLogout} className="logout-button">
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <h1 className="page-title">Your Dashboard</h1>
        
        <div className="cards-grid">
          <GoalsCard loading={loading} calories={calories} macros={macros} />
          <TodayCard
            todayCalories={todayCalories}
            todayMacros={todayMacros}
            calorieLimit={calories || DEFAULT_CALORIE_LIMIT}
            todayCaloriePercentage={todayCaloriePercentage}
          />
        </div>
      </main>
    </div>
  );
}

const GoalsCard = ({ loading, calories, macros }) => (
  <div className="card goals-card">
    <h2 className="card-title">Your Nutrition Goals</h2>
    {loading ? (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your goals...</p>
      </div>
    ) : (
      <div className="goals-content">
        <div className="circle-progress goals">
          <div className="circle-inner">
            <span className="value">{calories || 0}</span>
            <span className="label">kcal</span>
          </div>
        </div>
        <div className="macros-container">
          <h3 className="macros-title">Daily Macronutrients</h3>
          <div className="macros">
            <div className="macro-item">
              <span className="dot protein"></span>
              <div className="macro-info">
                <span className="macro-value">{macros?.protein || 0}g</span>
                <span className="macro-label">Protein</span>
              </div>
            </div>
            <div className="macro-item">
              <span className="dot carbs"></span>
              <div className="macro-info">
                <span className="macro-value">{macros?.carbs || 0}g</span>
                <span className="macro-label">Carbs</span>
              </div>
            </div>
            <div className="macro-item">
              <span className="dot fat"></span>
              <div className="macro-info">
                <span className="macro-value">{macros?.fats || 0}g</span>
                <span className="macro-label">Fat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

const TodayCard = ({
  todayCalories,
  todayMacros,
  calorieLimit,
  todayCaloriePercentage
}) => (
  <div className="card today-card">
    <h2 className="card-title">Today's Progress</h2>
    <div className="today-content">
      {todayCalories === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <p className="empty-text">You haven't logged any food yet today</p>
          <button 
            className="log-food-btn" 
            onClick={() => window.location.href = "/break"}
          >
            <Plus size={16} />
            Log Food
          </button>
        </div>
      ) : (
        <div className="progress-content">
          <div className="circle-container">
            <div className="circle-progress today" style={{ 
              '--percentage': todayCaloriePercentage 
            }}>
              <div className="circle-inner">
                <span className="value">{todayCalories}</span>
                <span className="label">kcal</span>
              </div>
            </div>
            <p className="progress-text">
              {Math.round(todayCaloriePercentage)}% of {calorieLimit} kcal goal
            </p>
          </div>

          <div className="macros-summary">
            <h3 className="macros-title">Macros Consumed</h3>
            <div className="macros">
              <div className="macro-item">
                <span className="dot protein"></span>
                <div className="macro-info">
                  <span className="macro-value">{todayMacros.protein}g</span>
                  <span className="macro-label">Protein</span>
                </div>
              </div>
              <div className="macro-item">
                <span className="dot carbs"></span>
                <div className="macro-info">
                  <span className="macro-value">{todayMacros.carbs}g</span>
                  <span className="macro-label">Carbs</span>
                </div>
              </div>
              <div className="macro-item">
                <span className="dot fat"></span>
                <div className="macro-info">
                  <span className="macro-value">{todayMacros.fat}g</span>
                  <span className="macro-label">Fat</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="log-food-btn" 
            onClick={() => window.location.href = "/break"}
          >
            <Plus size={16} />
            Add More Food
          </button>
        </div>
      )}
    </div>
  </div>
);
