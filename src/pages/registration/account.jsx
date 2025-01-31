import React, { useState } from "react";
import "./css/account.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";


const AccountCreation = ({ onProceed }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    return (
      <div className="navbar">
        <div className="logo" onClick={() => navigate("/homepage")}>
          <img src={logo || "/placeholder.svg"} alt="logo" className="logo-image" />
        </div>
        <div className="form-container">
          <div className="progress-bar">
            <div className="progress" style={{ width: "78%" }}></div>
          </div>
          <h2>Almost there! Create your account.</h2>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="button-group">
          <button className="back-btn" onClick={() => navigate("/heightweight")}>BACK</button>
            <button className="next-btn" onClick={() => navigate("/success")} disabled={!email || !password}>PROCEED</button>
          </div>
        </div>
      </div>
    );
  };

export default AccountCreation;