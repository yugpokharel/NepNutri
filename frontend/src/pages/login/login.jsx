import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/login.css";
import mainImage from "../../assets/treadmill.jpeg";
import foodImage from "../../assets/healthy-meal.jpg";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5001/users/login", // Adjust endpoint as needed
        { email, password },
        { withCredentials: true } // For session/cookie-based auth
      );

      if (response.status === 200) {
        // Successful login
        navigate("/dash");
        localStorage.setItem('user', JSON.stringify(response.data?.data))
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
      setError(errorMessage)
    } finally {
    setIsLoading(false);
    }
  };

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
          <p style={{ textAlign: "center", fontSize: "12px" }}>
            Track your body and be healthy
          </p>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" disabled={isLoading} /> Remember Me
              </label>
              <span style={{ cursor: "pointer", color: "#3498DB" }}>
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              className="proceed-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "PROCEED"}
            </button>
          </form>

          <button
            className="create-account-btn"
            onClick={() => navigate("/form")}
            disabled={isLoading}
          >
            CREATE AN ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;