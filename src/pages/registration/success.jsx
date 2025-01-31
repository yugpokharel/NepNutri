import React from "react";
import "./css/success.css";
import success from "../../assets/success.png"
import { useNavigate } from "react-router-dom";


const SuccessMessage = () => {
  const navigate = useNavigate();
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">
          <img src={success} alt="Success" />
        </div>
        <h2>Account created successfully!!!</h2>
        <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>GO TO DASHBOARD</button>
      </div>
    </div>
  );
};

export default SuccessMessage;
