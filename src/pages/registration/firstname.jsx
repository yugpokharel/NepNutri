import React from "react";
import "./css/firstname.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const FirstNameForm = ({ onNext, onBack }) => {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate("/homepage")}>
        <img src={logo || "/placeholder.svg"} alt="logo" className="logo-image" />
      </div>
      <div className="form-container">
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
        <h2>What’s your First name?</h2>
        <input type="text" placeholder="First Name" className="input-field" />
        <div className="button-group">
          <button className="back-btn" onClick={() => navigate("/login")}>BACK</button>
          <button className="next-btn" onClick={() => navigate("/goalselector")}>NEXT</button>
        </div>
      </div>
    </div>
  );
};

export default FirstNameForm;
