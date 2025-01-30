import React from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.css";
import counter from "./assets/counter.png";
import ProcessSection from "./ProcessSection"; 
import logo from "./assets/logo.png"
import PhilosophySection from "./Philosophy";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="scroll-container">
      {/* HomePage Content */}
      <div className="homepage">
        {/* Navbar */}
        <div className="navbar">
          <div className="logo" onClick={() => navigate("./HomePage.js")}>
            <img src={logo} alt="logo" className="logo-image"
            ></img> 
          </div>
          <div className="nav-links">
  <span onClick={() => navigate("/about")}>About</span>
  <span onClick={() => navigate("/process")}>Process</span>
  <span onClick={() => navigate("/blog")}>Blog</span>
  <span 
    className="login-button" 
    onClick={() => navigate("/login")}
  >
    Login
  </span>
</div>
        </div>

        {/* HomePage Content */}
        <div className="container">
          {/* Image Section */}
          <div className="image-section">
            <img src={counter} alt="counter" className="home-image" />
          </div>

          {/* Text Content */}
          <div className="text-content">
            <h2 className="subheading">Transform Your Health with</h2>
            <h1 className="heading">NepNutri; Personalized Nutrition Coaching</h1>
            <p className="description">
              Track your calories and reach your fitness goals with NepNutri. Our
              certified nutritionists are here to guide you throughout your journey
              of weight loss, weight gain, or simply maintaining a balanced and
              healthy lifestyle. Together, we'll help you achieve sustainable
              results and create habits that last a lifetime.
            </p>
            <button className="button" onClick={() => navigate("/onboarding")}>
              Get Started Today
            </button>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <ProcessSection />
      <PhilosophySection />
    </div>
    
  );
}

export default HomePage;