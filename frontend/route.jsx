// route.jsx (in root of /frontend)

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import Login from "./src/Pages/Login";
import Register from "./src/Pages/Register";
import Doctor from "./src/Pages/Doctor";
import AdminDashboard from "./src/Pages/AdminDashboard";
import PatientsRecords from "./src/Pages/PatientsRecords";
import LabTech from "./src/Pages/LabTech";

// Components
import BookAppointment from "./src/components/BookAppointmentForm";
import TodayAppointments from "./src/components/TodayAppointments";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/doctor", element: <Doctor /> },
  { path: "/lab-tech", element: <LabTech /> },
  { path: "/admin-dashboard", element: <AdminDashboard /> },
  { path: "/book-appointment", element: <BookAppointment /> },
  { path: "/appointments/today", element: <TodayAppointments /> },
  { path: "/records/:patientId", element: <PatientsRecords /> },
  {
    path: "*",
    element: (
      <div className="text-center p-6 text-red-500 text-lg">
        404 - Page Not Found
      </div>
    ),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
