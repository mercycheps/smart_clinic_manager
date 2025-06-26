import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';
import "../components/styling/register.css";

const Register = ({ initialData = {}, isLoading = false }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      email: initialData.email || '',
      phoneNumber: initialData.phoneNumber || '',
      specialty: initialData.specialty || '',
      licenseNumber: initialData.licenseNumber || '',
      experience: initialData.experience || '',
      education: initialData.education || '',
      address: initialData.address || '',
      bio: initialData.bio || '',
    },
  });

  const specialties = [
    'Cardiology', 'Dermatology', 'Neurology', 'Oncology',
    'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery',
  ];

  const handleRegister = async (data) => {
    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to register doctor");
      }

      navigate("/doctors");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error registering doctor");
    }
  };

  return (
    <div className="register-container">
      <header className="register-header">
        <div className="header-content">
          <div className="header-left">
            <Activity className="icon" />
            <h1 className="header-title">MedPractice Pro</h1>
          </div>
          <nav className="header-nav">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/doctors" className="nav-link">Doctors</Link>
            <Link to="/register" className="nav-link active">Add Doctor</Link>
          </nav>
        </div>
      </header>

      <div className="register-content">
        <Link to="/doctors" className="back-link">
          <ArrowLeft className="back-icon" />
          Back to Doctors
        </Link>

        <div className="form-container">
          <h2 className="form-title">
            {initialData.firstName ? 'Edit Doctor' : 'Add New Doctor'}
          </h2>

          <form onSubmit={handleSubmit(handleRegister)} className="form">
            {/* Inputs — abbreviated for brevity */}
            <div className="form-grid">
              <div>
                <label className="form-label">First Name *</label>
                <input {...register('firstName', { required: 'Required' })} className="form-input" />
                {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="form-label">Last Name *</label>
                <input {...register('lastName', { required: 'Required' })} className="form-input" />
                {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Add other fields like email, phoneNumber, etc. */}

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/doctors')} className="form-button cancel">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="form-button submit">
                {isLoading ? 'Saving...' : initialData.firstName ? 'Update Doctor' : 'Add Doctor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;