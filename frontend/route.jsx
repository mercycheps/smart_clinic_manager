import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RedirectLanding from "./src/Pages/RedirectLanding"; // Correct import for RedirectLanding
import Login from "./src/Pages/Login"; // Correct import for Login
import Doctor from "./src/Pages/Doctor";
import LabTech from "./src/Pages/LabTech";

// Lazy-loaded components
const AdminDashboard = React.lazy(() => import("./src/Pages/AdminDashboard"));
const TodayAppointments = React.lazy(() => import("./src/components/TodayAppointments"));
const PatientsRecords = React.lazy(() => import("./src/Pages/PatientsRecords"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RedirectLanding />, // Redirect based on user role
  },
  {
    path: "/login",
    element: <Login />, // Login page
  },
  {
    path: "/doctor",
    element: <Doctor />, // Doctor dashboard
  },
  {
    path: "/lab-tech",
    element: <LabTech />, // Lab technician dashboard
  },
  {
    path: "/AdminDashboard",
    element: (
      <Suspense fallback={<div>Loading Admin Dashboard...</div>}>
        <AdminDashboard />
      </Suspense>
    ),
  },
  {
    path: "/patient",
    element: <div>Patient Dashboard (coming soon)</div>, // Placeholder for Patient Dashboard
  },
  {
    path: "/appointments/today",
    element: (
      <Suspense fallback={<div>Loading Today's Appointments...</div>}>
        <TodayAppointments />
      </Suspense>
    ),
  },
  {
    path: "/records/:patientId",
    element: (
      <Suspense fallback={<div>Loading Patient Records...</div>}>
        <PatientsRecords />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <div>404 - Page Not Found</div>, // Catch-all route for undefined paths
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}