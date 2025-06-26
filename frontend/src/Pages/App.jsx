
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import PatientDashboard from "./PatientDashboard";
import Doctor from "./pages/Doctor";
import TodayAppointments from "./pages/TodayAppointments";
import React from "react";




import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


// Page Components
import Doctor from "./src/Pages/Doctor";
import Register from "./src/Pages/Register";
import Login from "./src/Pages/Login";
import PatientDashboard from "./src/Pages/PatientDashboard";


// Component Routes
import LabTech from "./src/components/LabTech";
import BookAppointment from "./src/components/BookAppointmentForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, //  Login default route
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/doctor",
    element: <Doctor />,
  },

  {
    path: "/lab-tech",
    element: <LabTech />,
  },

  {
    path: "/dashboard/patient",
    element: <PatientDashboard />,
  },

  {
    path: "/book-appointment",
    element: <BookAppointment />,
  },
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
