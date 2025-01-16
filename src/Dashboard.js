import React from "react";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const { state } = useLocation(); // Get profile data passed from ProfileSetup

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome to Your Dashboard</h1>
      <p>Track your progress and reach your goals, {state?.name || "User"}!</p>
      <p>Your goal is: {state?.goal || "Not set"}</p>
      <button style={{ padding: "10px 20px", cursor: "pointer" }}>Start Tracking</button>
    </div>
  );
}

export default Dashboard;
