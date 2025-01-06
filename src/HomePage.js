import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "21px" }}>
      <h1>Welcome to NepNutri</h1>
      <p>Track your calories and reach your fitness goals!</p>
      <button 
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }} 
        onClick={() => navigate("/onboarding")}
      >
        Get Started
      </button>
    </div>
  );
}

export default HomePage;
