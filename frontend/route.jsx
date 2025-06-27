import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Pages
import Login from "./src/Pages/Login.jsx";
import RegisterOptions from "./src/Pages/RegisterOptions.jsx";
import RegisterDoctor from "./src/Pages/Register.jsx";
import RegisterLabTech from "./src/Pages/labReg.jsx";
import RegisterPatient from "./src/Pages/patientRegistration.jsx";
import Doctor from "./src/Pages/Doctor.jsx";
import AdminDashboard from "./src/Pages/AdminDashboard.jsx";
import PatientDashboard from "./src/Pages/PatientDashboard.jsx";
import PatientsRecords from "./src/Pages/PatientsRecords.jsx";
import LabTech from "./src/Pages/LabTech.jsx";
import Appointments from "./src/Pages/Appointments.jsx";
import PrescriptionManager from "./src/Pages/PrescriptionManager.jsx";

// Components
import TodayAppointments from "./src/components/TodayAppointments.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <RegisterOptions /> },
  { path: "/register-doctor", element: <RegisterDoctor /> },
  { path: "/register-labtech", element: <RegisterLabTech /> },
  { path: "/register-patient", element: <RegisterPatient /> },
  { path: "/doctor", element: <Doctor /> },
  { path: "/patients-dashboard", element: <PatientDashboard /> },
  { path: "/lab-tech", element: <LabTech /> },
  { path: "/admin-dashboard", element: <AdminDashboard /> },
  { path: "/book-appointment", element: <Appointments /> },
  { path: "/prescriptions", element: <PrescriptionManager /> },
  { path: "/appointments/today", element: <TodayAppointments /> },
  { path: "/records/:patientId", element: <PatientsRecords /> },
  { path: "/patient", element: <Navigate to="/patients-dashboard" replace /> },
  {
    path: "*",
    element: (
      <div style={{ textAlign: "center", padding: "2rem", color: "red", fontSize: "1.25rem" }}>
        404 - Page Not Found
      </div>
    ),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}