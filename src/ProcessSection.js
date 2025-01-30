import React from "react";
import "./ProcessSection.css";

function ProcessSection() {
  return (
    <div className="process-section">
      <h2 className="process-heading">How it works?</h2>
      <p className="process-description">
        Welcome to the Process Section of NepNutri, your ultimate destination for all things nutrition and wellness.
      </p>

      <div className="process-steps">
        {/* Step 1 */}
        <div className="step">
          <div className="step-number">1.</div>
          <h3 className="step-title">Track your food, fitness & supplements</h3>
          <p className="step-description">
            Log your daily diet and workouts, and we will track the calories and macros for you.
          </p>
          <button 
            className="step-button"
            aria-label="Learn how tracking works"
          >
            Learn how it works
          </button>
        </div>

        {/* Step 2 */}
        <div className="step">
          <div className="step-number">2.</div>
          <h3 className="step-title">Science-backed diet plans</h3>
          <p className="step-description">
            Research-based meal plans that adapt to your lifestyle and preferences.
          </p>
          <button 
            className="step-button"
            aria-label="Explore diet plans"
          >
            View Plans
          </button>
        </div>

        {/* Step 3 */}
        <div className="step">
          <div className="step-number">3.</div>
          <h3 className="step-title">Sustainable habit building</h3>
          <p className="step-description">
            Personalized coaching to help you maintain lifelong healthy habits.
          </p>
          <button 
            className="step-button"
            aria-label="Start habit building"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProcessSection;