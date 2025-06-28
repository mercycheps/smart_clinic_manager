// src/route.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import LabTechDashboard from './components/LabTechDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function RouteApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/patient-dashboard" element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        } />

        <Route path="/doctor-dashboard" element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/labtech-dashboard" element={
          <ProtectedRoute>
            <LabTechDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default RouteApp;
