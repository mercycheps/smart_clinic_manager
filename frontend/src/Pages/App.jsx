
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import PatientDashboard from "./PatientDashboard";
import Doctor from "./pages/Doctor";
import TodayAppointments from "./pages/TodayAppointments";
import React from "react";

function App() {
  const handleDoctorSubmit = (data) => {
    console.log("Submitted Doctor Data:", data);
  };

  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/appointments/today" element={<TodayAppointments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
