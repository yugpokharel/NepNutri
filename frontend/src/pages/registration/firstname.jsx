import React, { useState } from "react";
import "./css/firstname.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const FirstNameForm = () => {
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = async () => {
    // Check for empty or invalid first name (letters only, spaces allowed)
    if (!firstName.trim() || !/^[A-Za-z\s]+$/.test(firstName.trim())) {
        setError("Please enter a valid first name (letters only).");
        return;
    }

    setError(""); // Clear previous error on valid input
    setLoading(true);

    try {
        console.log("Sending request with:", JSON.stringify({ firstname: firstName })); // Send 'firstname'

        const response = await fetch("http://localhost:5001/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstname: firstName }) // Use 'firstname' key to match the backend
        });

        const responseData = await response.json();
        console.log("Server response:", responseData);

        if (!response.ok) {
            throw new Error(responseData.message || "Failed to save data. Try again.");
        }

        // Store the firstName for later use and navigate to goal selection
        localStorage.setItem("firstName", firstName); // Store the name in localStorage
        navigate("/goalselector", { state: { firstName } }); // Pass the firstName to the next page
    } catch (error) {
        console.error("Error:", error);
        setError(error.message || "Failed to save your data. Please try again.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="form-page">
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/homepage")}>
          <img src={logo || "/placeholder.svg"} alt="logo" className="logo-image" />
        </div>
      </nav>

      <div className="form-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: "20%" }}></div>
        </div>

        <h2>What’s your First Name?</h2>
        <input
          type="text"
          placeholder="First Name"
          className="input-field"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)} // Update state on input change
          aria-label="First Name"
        />

        {error && <p className="error-message">{error}</p>}

        <div className="button-group">
          <button type="button" className="back-btn" onClick={() => navigate("/login")}>
            BACK
          </button>
          <button type="button" className="next-btn" onClick={handleNext} disabled={loading}>
            {loading ? "Saving..." : "NEXT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstNameForm;
