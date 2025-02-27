import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/login.css";
import mainImage from "../../assets/treadmill.jpeg";
import foodImage from "../../assets/healthy-meal.jpg";
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5001/users/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/dash");
        localStorage.setItem('user', JSON.stringify(response.data?.data));
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err);
      const status = err.response?.status;
      let errorMessage;
      if (status === 404) {
        errorMessage = "Email not found. Please register first.";
      } else if (status === 401) {
        errorMessage = "Invalid password.";
      } else {
        errorMessage = "Login failed. Please try again.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="image-container">
          <img src={mainImage || "/placeholder.svg"} alt="Woman on treadmill" className="main-image" />
          <img src={foodImage || "/placeholder.svg"} alt="Healthy food" className="overlay-image" />
        </div>

        <div className="login-form">
          <h2>Log In to NepNutri</h2>
          <p className="subtitle">Track your body and be healthy</p>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="*********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" disabled={isLoading} /> Remember Me
              </label>
              <span className="forgot-password">Forgot Password?</span>
            </div>

            <button
              type="submit"
              className="proceed-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "PROCEED"}
            </button>
          </form>

          <div className="alternative-actions">
            <button
              className="create-account-btn"
              onClick={() => navigate("/form")}
              disabled={isLoading}
            >
              CREATE AN ACCOUNT
            </button>
            <button
              className="admin-login-btn"
              onClick={() => navigate("/adminlogin")}
              disabled={isLoading}
            >
              ADMIN LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
