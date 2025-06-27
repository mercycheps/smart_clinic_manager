// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Pages/App"; // ✅ This imports the updated App.jsx

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
