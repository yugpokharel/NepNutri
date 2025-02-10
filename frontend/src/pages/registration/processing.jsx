import React from "react";
import "./css/processing.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const ProcessingPage = () => {
  const navigate = useNavigate();

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
          <img src="/exercise-tip.png" alt="exercise tip" className="info-image" />
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;
