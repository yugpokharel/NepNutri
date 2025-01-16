import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileSetup() {
  const [profile, setProfile] = useState({ name: "", age: "", goal: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Profile Data:", profile); // Save data or send to backend
    navigate("/dashboard", { state: profile }); // Pass profile data to dashboard
  };  

  // Disable submit if the fields are empty
  const isFormValid = profile.name && profile.age && profile.goal;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Set Up Your Profile</h2>
      <input 
        name="name" 
        placeholder="Name" 
        value={profile.name} 
        onChange={handleChange} 
        style={{ padding: "10px", margin: "10px", width: "250px" }} 
      />
      <input 
        name="age" 
        placeholder="Age" 
        value={profile.age} 
        onChange={handleChange} 
        style={{ padding: "10px", margin: "10px", width: "250px" }} 
      />
      <select 
        name="goal" 
        value={profile.goal} 
        onChange={handleChange} 
        style={{ padding: "10px", margin: "10px", width: "250px" }}
      >
        <option value="">Select Goal</option>
        <option value="Weight Loss">Weight Loss</option>
        <option value="Weight Gain">Weight Gain</option>
        <option value="Maintain Weight">Maintain Weight</option>
      </select>
      <button 
        style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }} 
        onClick={handleSubmit}
        disabled={!isFormValid}  // Disable button if form is incomplete
      >
        Finish
      </button>
    </div>
  );
}

export default ProfileSetup;
