
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import PatientDashboard from "./PatientDashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/patient" element={<PatientDashboard />} />
        </Routes>
      </div>
    </Router>

  );
}


export default App;
