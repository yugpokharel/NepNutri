import React, { useState } from "react";
import "./css/goal.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const GoalSelection = () => {
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message
  const [loading, setLoading] = useState(false); // State to track loading status
  const navigate = useNavigate();
  const location = useLocation();
  const firstName = location.state?.firstName || "";

  const toggleGoal = (goal) => {
    let updatedGoals = [...selectedGoals];
    const primaryGoals = ["Lose Weight", "Gain Weight", "Maintain Weight"];

    if (updatedGoals.includes(goal)) {
      updatedGoals = updatedGoals.filter((g) => g !== goal);
    } else {
      if (primaryGoals.includes(goal)) {
        updatedGoals = updatedGoals.filter((g) => !primaryGoals.includes(g));
      }
      updatedGoals.push(goal);
    }

    console.log("Updated Goals: ", updatedGoals); // Debugging line
    setSelectedGoals(updatedGoals);
  };

  const handleNext = async () => {
    if (selectedGoals.length === 0) {
      alert("Please select at least one goal");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: firstName,
          goal: selectedGoals[0], // Send the selected goal
        }),
      });
  
      if (response.ok) {
        navigate("/comment"); // Navigate to the next page
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate("/homepage")}>
        <img src={logo || "/placeholder.svg"} alt="logo" className="logo-image" />
      </div>
      <div className="form-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: "25%" }}></div>
        </div>
        <h2>
          Thanks, {firstName}!
          <br />
          Now pick your Goal
        </h2>
        <div className="goal-options">
          {["Lose Weight", "Gain Weight", "Gain Muscle", "Maintain Weight"].map((goal) => (
            <button
              key={goal}
              className={`goal-btn ${selectedGoals.includes(goal) ? "selected" : ""}`}
              onClick={() => toggleGoal(goal)}
            >
              {goal}
            </button>
          ))}
        </div>

        {/* Display error message if there's any */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="button-group">
          <button className="back-btn" onClick={() => navigate("/firstname")}>BACK</button>
          <button className="next-btn" onClick={handleNext} disabled={selectedGoals.length === 0 || loading}>
            {loading ? "Loading..." : "NEXT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalSelection;
