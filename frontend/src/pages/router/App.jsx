import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../homepage/HomePage";
import Login from "../login/login";
import FirstNameForm from "../registration/firstname";
import GoalSelection from "../registration/GoalSelection";
import BarrierSelection from "../registration/barrierselection";
import HeightWeightForm from "../registration/heightweight";
import AccountCreation from "../registration/account";
import Comment from "../registration/comment";
import GenderSelection from "../registration/genderselection";
import SuccessMessage from "../registration/success";
import DashboardWelcome from "../registration/dashboard";
import ProcessingPage from "../registration/processing";
import Dashboard from "../dashboard/dash";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route to open HomePage */}
        <Route path="/" element={<Navigate to="/homepage" />} />

        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/firstname" element={<FirstNameForm />} />
        <Route path="/goalselector" element={<GoalSelection />} />
        <Route path="/barrier" element={<BarrierSelection />} />
        <Route path="/heightweight" element={<HeightWeightForm />} />
        <Route path="/account" element={<AccountCreation />} />
        <Route path="/comment" element={<Comment />} />
        <Route path="/gender" element={<GenderSelection />} />
        <Route path="/success" element={<SuccessMessage />} />
        <Route path="/dashboard" element={<DashboardWelcome />} />
        <Route path="/process" element={<ProcessingPage />} />
        <Route path="/dash" element={<Dashboard />} />



      </Routes>
    </Router>
  );
}

export default App;