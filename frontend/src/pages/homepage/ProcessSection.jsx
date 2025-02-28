import { Navigate, useNavigate } from "react-router-dom"
import "./css/ProcessSection.css"
import React from "react"

function ProcessSection() {
  const navigate = useNavigate()
  return (
    <section className="process-section">
      <div className="process-container">
        <h2 className="process-heading">How it works?</h2>
        <p className="process-description">
          Welcome to the Process Section of NepNutri, your ultimate destination for all things nutrition and wellness.
        </p>

        <div className="process-steps">
          {/* Step 1 */}
          <div className="step">
            <div className="step-icon clipboard-icon"></div>
            <h3 className="step-title">Track your food, fitness & supplements</h3>
            <p className="step-description">
              Log your daily diet and workouts, and we will track the calories and macros for you.
            </p>
            <button className="step-button" aria-label="Learn how tracking works">
              Learn how it works
              <span className="arrow-icon"></span>
            </button>
          </div>

          {/* Step 2 */}
          <div className="step">
            <div className="step-icon flask-icon"></div>
            <h3 className="step-title">Science-backed diet plans</h3>
            <p className="step-description">Research-based meal plans that adapt to your lifestyle and preferences.</p>
            <button className="step-button" aria-label="Explore diet plans">
              View Plans
              <span className="arrow-icon"></span>
            </button>
          </div>

          {/* Step 3 */}
          <div className="step">
            <div className="step-icon target-icon"></div>
            <h3 className="step-title">Sustainable habit building</h3>
            <p className="step-description">Personalized coaching to help you maintain lifelong healthy habits.</p>
            <button className="step-button" aria-label="Start habit building"
            onClick={() => navigate("/login")}>
              Get Started
              <span className="arrow-icon"></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProcessSection


//
///
///
///

///
///

///
///

///
///
///


///
///
///

///
///


///
///
///

///
///

///
///
///


///
///

///
///

///
///
///

///
///
///

///
///

///
///
///


///
///

///
///

///
///
///
///
///
///

///
///

///
///
///


///
///

///
///

///
///
///
///
///
///

///
///

///
///
///


///
///

///
///

///
///
///
///
///
///

///
///

///
///
///


///
///

///
///

///
///
///
///
///
///

///
///

///
///
///


///
///

///
///

///
///
///
///
///
///

///
///

///
///
///


///
///

///
///

///
///
///
///
///
///

///
///

///
///
///


///
///

///
///

///
///
///


