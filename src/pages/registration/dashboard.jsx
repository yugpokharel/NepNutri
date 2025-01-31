import React, { useEffect } from "react";
import "./css/dashboard.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import tips from "../../assets/tip.jpeg"

const ProcessingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // Change this to the actual next page route
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="processing-page">
      <div className="logo" onClick={() => navigate("/homepage")}> 
        <img src={logo || "/placeholder.svg"} alt="logo" className="logo-image" />
      </div>
      <div className="processing-container">
        <h2 className="processing-text">Processing Your Information!!!!</h2>
        <div className="loading-indicator"></div>
        <div className="info-box">
          <p className="info-title">💡 Did You Know?</p>
          <p className="info-text">"Regular exercise boosts your resting metabolism, meaning your body continues to burn calories even while you're at rest!"</p>
          <img src={tips} alt="exercise tip" className="info-image" />
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;
