import React, { useState, useEffect } from "react";
import "./css/gender.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const GenderSelection = ({ onNext, onBack }) => {
  const [gender, setGender] = useState(null);
  const [birthDate, setBirthDate] = useState({ month: "", day: "", year: "" });
  const [location, setLocation] = useState("Nepal");
  const [dayOptions, setDayOptions] = useState([]);
  const navigate = useNavigate();

  // Function to get the number of days in a given month and year
  const getDaysInMonth = (month, year) => {
    const daysInMonth = {
      1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
      7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
    };

    // Check for leap year in February
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))) {
      return 29;
    }

    return daysInMonth[month];
  };

  // Update day options based on selected month and year
  useEffect(() => {
    if (birthDate.month && birthDate.year) {
      const daysInMonth = getDaysInMonth(Number(birthDate.month), Number(birthDate.year));
      const newDayOptions = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      setDayOptions(newDayOptions);
    }
  }, [birthDate.month, birthDate.year]);

  // Generate year options (e.g., last 100 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

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
            <input
              type="radio"
              name="gender"
              value="Male"
              onChange={() => setGender("Male")}
            /> Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={() => setGender("Female")}
            /> Female
          </label>
        </div>
        <h3>When were you born?</h3>
        <div className="birthdate-inputs">
          <select
            value={birthDate.month}
            onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value, day: "" })} // Reset day when month changes
          >
            <option value="">MM</option>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>

          <select
            value={birthDate.day}
            onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
          >
            <option value="">DD</option>
            {dayOptions.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>

          <select
            value={birthDate.year}
            onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value, day: "" })} // Reset day when year changes
          >
            <option value="">YYYY</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
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
        </select>

        <div className="button-group">
          <button className="back-btn" onClick={() => navigate("/barrier")}>BACK</button>
          <button
            className="next-btn"
            onClick={() => navigate("/heightweight")}
            disabled={!gender || !birthDate.month || !birthDate.day || !birthDate.year}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenderSelection;
