import React, { useState } from "react";
import "./css/goal.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const GoalSelection = ({ onNext, onBack }) => {
  const [selectedGoals, setSelectedGoals] = useState([]);
  const navigate = useNavigate();

  const toggleGoal = (goal) => {
    let updatedGoals = [...selectedGoals];
    const primaryGoals = ["Lose Weight", "Gain Weight", "Maintain Weight"];
    // const secondaryGoal = "Gain Muscle";
    
    if (updatedGoals.includes(goal)) {
      updatedGoals = updatedGoals.filter((g) => g !== goal);
    } else {
      if (primaryGoals.includes(goal)) {
        updatedGoals = updatedGoals.filter((g) => !primaryGoals.includes(g));
      }
      updatedGoals.push(goal);
    }
    setSelectedGoals(updatedGoals);
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
        <h2>Thanks, FirstName!<br />Now pick your Goal</h2>
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
        <div className="button-group">
          <button className="back-btn" onClick={() => navigate("/firstname")}>BACK</button>
          <button className="next-btn" onClick={() => navigate("/barrier")} disabled={selectedGoals.length === 0}>NEXT</button>
        </div>
      </div>
    </div>
  );
};

export default GoalSelection;
