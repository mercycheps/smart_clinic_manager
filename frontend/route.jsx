import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Doctor from "./src/Pages/Doctor";
import Register from "./src/Pages/Register";
import LabTech from "./src/components/LabTech";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />, // Landing page after wrapping with <BrowserRouter>
  },
  {
    path: "doctor",
    element: <Doctor />,
  },
  {
    path: "lab-tech",
    element: <LabTech />,
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
