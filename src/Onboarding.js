import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Onboarding() {
  const navigate = useNavigate(); // Define navigate function

  return (
    <div>
      <h1>Onboarding</h1>
      <p>Let’s set up your profile and goals!</p>
      <button 
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }} 
        onClick={() => navigate("/authpage")} // Use navigate to redirect
      >
        Sign in
      </button>
    </div>
  );
}

export default Onboarding;
