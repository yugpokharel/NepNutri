import React from "react";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Welcome Back!</h2>
      <button 
        style={{ padding: "10px 20px", margin: "10px", cursor: "pointer" }} 
        onClick={() => navigate("/profile-setup")}
      >
        Sign Up
      </button>
      <button 
        style={{ padding: "10px 20px", cursor: "pointer" }} 
        onClick={() => navigate("/dashboard")}
      >
        Login
      </button>
    </div>
  );
}

export default AuthPage;
