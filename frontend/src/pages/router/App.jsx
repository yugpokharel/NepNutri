import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../homepage/HomePage";
import Login from "../login/login";
import Dashboard from "../dashboard/dash";
import MultiStepRegistration from "../registration/regform";
import AddBreakfastAndMeal from "../dashboard/AddBreakfastAndMeal/AddBreakfastAndMeal";
import BreakFast from "../../components/BreakFast/BreakFast";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<MultiStepRegistration />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/foodlog" element={<AddBreakfastAndMeal />} />


        //components 
        <Route path="/foodlog/break" element={<BreakFast />} />

      </Routes>
    </Router>
  );
}

export default App;