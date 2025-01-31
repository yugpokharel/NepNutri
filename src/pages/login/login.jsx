import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";
import mainImage from "../../assets/treadmill.jpeg";
import foodImage from "../../assets/healthy-meal.jpg";

function Login() {
  const navigate = useNavigate();

  return (
    <div>

      {/* Main Container */}
      <div className="login-container">
        {/* Left Section - Image */}
        <div className="image-container">
          <img src={mainImage} alt="Woman on treadmill" className="main-image" />
          <img src={foodImage} alt="Healthy food" className="overlay-image" />
        </div>

        {/* Right Section - Login Form */}
        <div className="login-form">
          <h2>Log In to NepNutri</h2>
          <p style={{ textAlign: "center", fontSize: "12px" }}>Track your body and be healthy</p>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="your@email.com" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="*********" />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <span style={{ cursor: "pointer", color: "#3498DB" }}>Forgot Password?</span>
          </div>

          <button className="proceed-btn">PROCEED</button>
          <button className="create-account-btn" onClick={() => navigate("/firstname")}>
            CREATE AN ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
