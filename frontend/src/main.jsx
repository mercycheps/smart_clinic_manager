// main.jsx ✅
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "../route"; // or wherever AppRouter is

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter /> {/* AppRouter already uses RouterProvider */}
  </React.StrictMode>
);
