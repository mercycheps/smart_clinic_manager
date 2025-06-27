import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectLanding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");

    switch (role) {
      case "admin":
        navigate("/AdminDashboard");
        break;
      case "doctor":
        navigate("/doctor");
        break;
      case "labtech":
        navigate("/lab-tech");
        break;
      case "patient":
        navigate("/patient"); // <- Make sure to create this route
        break;
      default:
        navigate("/login");
        break;
    }
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default RedirectLanding;
