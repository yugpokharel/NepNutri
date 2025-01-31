import React, { useState } from "react";
import "./css/gender.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const GenderSelection = ({ onNext, onBack }) => {
  const [gender, setGender] = useState(null);
  const [birthDate, setBirthDate] = useState({ month: "", day: "", year: "" });
  const [location, setLocation] = useState("Nepal");
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate("/homepage")}>
        <img src={logo || "/placeholder.svg"} alt="logo" className="logo-image" />
      </div>
      <div className="form-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: "60%" }}></div>
        </div>
        <h2>Please select which gender we should use to calculate your calorie needs.</h2>
        <div className="gender-options">
          <label>
            <input type="radio" name="gender" value="Male" onChange={() => setGender("Male")} /> Male
          </label>
          <label>
            <input type="radio" name="gender" value="Female" onChange={() => setGender("Female")} /> Female
          </label>
        </div>
        <h3>When were you born?</h3>
        <div className="birthdate-inputs">
          <select value={birthDate.month} onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}>
            <option value="">MM</option>
            {/* Add month options */}
          </select>
          <select value={birthDate.day} onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}>
            <option value="">DD</option>
            {/* Add day options */}
          </select>
          <select value={birthDate.year} onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}>
            <option value="">YYYY</option>
            {/* Add year options */}
          </select>
        </div>
        <h3>Where do you live?</h3>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="Nepal">Nepal</option>
<option value="India">India</option>
<option value="China">China</option>
<option value="United States">United States</option>
<option value="Germany">Germany</option>
<option value="France">France</option>
<option value="Brazil">Brazil</option>
<option value="Japan">Japan</option>
<option value="Australia">Australia</option>
<option value="South Africa">South Africa</option>
<option value="Canada">Canada</option>
<option value="Mexico">Mexico</option>
<option value="Russia">Russia</option>
<option value="United Kingdom">United Kingdom</option>
<option value="Italy">Italy</option>
<option value="Argentina">Argentina</option>
<option value="Spain">Spain</option>
<option value="South Korea">South Korea</option>
<option value="Egypt">Egypt</option>
<option value="Turkey">Turkey</option>


          {/* Add more locations if needed */}
        </select>
        <div className="button-group">
          <button className="back-btn" onClick={() => navigate(-1)}>BACK</button>
          <button className="next-btn" onClick={() => navigate("/heightweight")} disabled={!gender || !birthDate.month || !birthDate.day || !birthDate.year}>NEXT</button>
        </div>
      </div>
    </div>
  );
};

export default GenderSelection;
