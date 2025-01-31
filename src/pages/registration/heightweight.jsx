import React, { useState } from "react";
import "./css/heightweight.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const HeightWeightForm = ({ onNext, onBack }) => {
    const [heightFeet, setHeightFeet] = useState("");
    const [heightInches, setHeightInches] = useState("");
    const [currentWeight, setCurrentWeight] = useState("");
    const [goalWeight, setGoalWeight] = useState("");
    const navigate = useNavigate();
  
    const handleInputChange = (setter) => (e) => {
      const value = e.target.value;
      if (value === "" || (parseFloat(value) >= 0)) {
        setter(value);
      }
    };
  
    return (
      <div className="navbar">
        <div className="logo" onClick={() => navigate("/homepage")}>
          <img src={logo || "/placeholder.svg"} alt="logo" className="logo-image" />
        </div>
        <div className="form-container">
          <div className="progress-bar">
            <div className="progress" style={{ width: "80%" }}></div>
          </div>
          <h2>How tall are you?</h2>
          <div className="input-group">
            <input
              type="number"
              placeholder="Feet(ft.)"
              value={heightFeet}
              onChange={handleInputChange(setHeightFeet)}
            />
            <input
              type="number"
              placeholder="Inches(in)"
              value={heightInches}
              onChange={handleInputChange(setHeightInches)}
            />
          </div>
          <h2>How much do you weigh?</h2>
          <input
            type="number"
            placeholder="Current weight (kg)"
            value={currentWeight}
            onChange={handleInputChange(setCurrentWeight)}
          />
          <h2>What's your goal weight?</h2>
          <input
            type="number"
            placeholder="Goal weight (kg)"
            value={goalWeight}
            onChange={handleInputChange(setGoalWeight)}
          />
          <div className="button-group">
            <button className="back-btn" onClick={() => navigate("/barrier")}>BACK</button>
            <button className="next-btn" onClick={() => navigate("/account")} disabled={!heightFeet || !currentWeight || !goalWeight}>NEXT</button>
          </div>
        </div>
      </div>
    );
  };
export default HeightWeightForm;
