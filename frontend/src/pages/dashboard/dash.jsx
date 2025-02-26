import { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [calories, setCalories] = useState(null);
  const [macros, setMacros] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5001/users/calculate",
          { email: JSON.parse(localStorage.getItem('user'))?.email },
          {
            withCredentials: true,
          }
        );

        console.log(response.data.data.calories);
        

        setCalories(response.data?.data?.calories);
        setMacros(response.data?.data?.macros);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Replace hardcoded username with dynamic one from userData
  const username = userData?.firstName || "User";

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-14%20at%2010.01.20%20PM-SEhypaHI1507ccFEJrr5my54OyTHo0.png"
            alt="UpNutri"
            className="logo"
          />
          <div className="header-right">
            <span className="greeting">
              Hi, <span className="username">{username}</span>
            </span>
            <button className="log-out-btn">⚙️</button>
            <a href="#" className="header-link">
              Help
            </a>
            <a href="#" className="header-link">
              Settings
            </a>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/login";
              }}
              className="logout-link"
            >
              Log Out
            </button>
            <div className="social-links">
              <a href="#" className="social-link">
                📷
              </a>
              <a href="#" className="social-link">
                🐦
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Nav */}
      <nav className="main-nav">
        <a href="#" className="nav-link active">
          Home
        </a>
        <a href="#" className="nav-link">
          Food
        </a>
        <a href="#" className="nav-link">
          Exercises
        </a>
        <a href="#" className="nav-link">
          Community
        </a>
        <a href="#" className="nav-link">
          Blog
        </a>
      </nav>

      {/* Content */}
      <main className="main-content">
        <div className="cards-grid">
          {/* Goals Card */}
          <div className="card">
            <h2>Based on your information, your goals</h2>
            {loading ? (
              <p>Loading your goals...</p>
            ) : (
              <div className="goals-content">
                <div className="circle-progress goals">
                  <div className="circle-inner">
                    <span className="value">{calories || 0}</span>
                    <span className="label">kcal</span>
                  </div>
                </div>
                <div className="macros">
                  <div className="macro-item">
                    <span className="dot protein"></span>
                    <span>{macros?.protein || 0}g Protein</span>
                  </div>
                  <div className="macro-item">
                    <span className="dot carbs"></span>
                    <span>{macros?.carbs || 0}g Carbs</span>
                  </div>
                  <div className="macro-item">
                    <span className="dot fat"></span>
                    <span>{macros?.fats || 0}g Fat</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Today Card */}
          <div className="card">
            <h2>Today</h2>
            <div className="today-content">
              <div className="circle-progress empty">
                <div className="circle-inner">
                  <span className="value">0</span>
                  <span className="label">kcal</span>
                </div>
              </div>
              <p className="empty-text">you haven't logged any food yet</p>
              <button className="log-food-btn">Log Food</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
