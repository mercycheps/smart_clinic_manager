import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Doctor from "./src/Pages/Doctor";
import LabTech from "./src/components/LabTech";

// Lazy-loaded components
const AdminDashboard = React.lazy(() => import("./src/Pages/AdminDashboard"));
const TodayAppointments = React.lazy(() => import("./src/components/TodayAppointments"));

const router = createBrowserRouter([
  {
    path: "/doctor",
    element: <Doctor />,
  },
  {
    path: "/lab-tech",
    element: <LabTech />,
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
    path: "/appointments/today",
    element: (
      <Suspense fallback={<div>Loading Today's Appointments...</div>}>
        <TodayAppointments />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
