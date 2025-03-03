import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../homepage/HomePage";
import Login from "../login/login";
import Dashboard from "../dashboard/dash";
import MultiStepRegistration from "../registration/regform";
import AddFoodToBreakfast from "../dashboard/AddBreakfastAndMeal/Addfood";
import ProcessSection from "../homepage/ProcessSection";
import Footer from "../homepage/footer";
import ContactUs from "../homepage/ContactUs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<MultiStepRegistration />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/break" element={<AddFoodToBreakfast />} />
        <Route path="/process" element={<ProcessSection />} />
        <Route path="/about" element={<Footer />} />
        <Route path="/contact" element={<ContactUs />} />









      </Routes>
    </Router>
  );
}

export default App;