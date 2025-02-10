import React, { useState } from "react";
import "./css/barrier.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const BarrierSelection = ({ onNext, onBack }) => {
  const [selectedBarriers, setSelectedBarriers] = useState([]);
  const navigate = useNavigate();

  const toggleBarrier = (barrier) => {
    let updatedBarriers = [...selectedBarriers];
    if (updatedBarriers.includes(barrier)) {
      updatedBarriers = updatedBarriers.filter((b) => b !== barrier);
    } else {
      updatedBarriers.push(barrier);
    }
    setSelectedBarriers(updatedBarriers);
  };

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate("/homepage")}>
        <img src={logo || "/placeholder.svg"} alt="logo" className="logo-image" />
      </div>
      <div className="form-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: "35%" }}></div>
        </div>
        <h2>In the past, what have been your barriers to losing weight?</h2>
        <div className="barrier-options">
          {["Lack of time", "Lack of training", "Social eating and events", "Difficult to make food choices", "Food Craving"].map((barrier) => (
            <button
              key={barrier}
              className={`barrier-btn ${selectedBarriers.includes(barrier) ? "selected" : ""}`}
              onClick={() => toggleBarrier(barrier)}
            >
              {barrier}
            </button>
          ))}
        </div>
        <div className="button-group">
          <button className="back-btn" onClick={() => navigate("/goalselector")}>BACK</button>
          <button className="next-btn" onClick={() => navigate("/comment")} disabled={selectedBarriers.length === 0}>NEXT</button>
        </div>
      </div>
    </div>
  );
};

export default BarrierSelection;
