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
