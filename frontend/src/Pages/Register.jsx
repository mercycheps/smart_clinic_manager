import React, { useState } from 'react';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import LabTechnicianFields from '../components/LabTechnicianFields';
import DoctorFields from "../components/DoctorsFields";
import PatientFields from "../components/patientsField";
import { validatePassword, validateEmail, validatePhone } from "../utils/Validations";
import "../components/styles/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    termsAccepted: false,
  });

  const [doctorData, setDoctorData] = useState({
    medicalLicenseNumber: '',
    specialization: '',
    yearsOfExperience: 0,
    clinicName: '',
    workSchedule: [],
  });

  const [labTechData, setLabTechData] = useState({
    certificationId: '',
    assignedDepartment: '',
    workShift: '',
  });

  const [patientData, setPatientData] = useState({
    dateOfBirth: '',
    gender: '',
    medicalHistory: '',
    insuranceProvider: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!validatePhone(formData.phoneNumber)) newErrors.phoneNumber = 'Valid phone number is required';

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) newErrors.password = 'Password requirements not met';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.termsAccepted) newErrors.terms = 'You must accept terms and conditions';

    if (formData.role === 'doctor') {
      if (!doctorData.medicalLicenseNumber) newErrors.medicalLicense = 'Medical license is required';
      if (!doctorData.specialization) newErrors.specialization = 'Specialization is required';
      if (!doctorData.clinicName) newErrors.clinicName = 'Clinic name is required';
      if (doctorData.workSchedule.length === 0) newErrors.workSchedule = 'Work schedule is required';
    }

    if (formData.role === 'lab-technician') {
      if (!labTechData.certificationId) newErrors.certificationId = 'Certification ID is required';
      if (!labTechData.assignedDepartment) newErrors.assignedDepartment = 'Department is required';
      if (!labTechData.workShift) newErrors.workShift = 'Work shift is required';
    }

    if (formData.role === 'patient') {
      if (!patientData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!patientData.gender) newErrors.gender = 'Gender is required';
      if (!patientData.emergencyContactName) newErrors.emergencyContactName = 'Emergency contact name is required';
      if (!patientData.emergencyContactPhone) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fix the errors before submitting");
      return;
    }

    const payload = {
      email: formData.email,
      username: formData.fullName.split(' ').join('').toLowerCase(),
      password: formData.password,
      role: formData.role,
      fullName: formData.fullName,
      phone: formData.phoneNumber,
    };

    if (formData.role === 'doctor') {
      payload.licenseNumber = doctorData.medicalLicenseNumber;
      payload.specialization = doctorData.specialization;
    } else if (formData.role === 'lab-technician') {
      payload.certificationId = labTechData.certificationId;
    } else if (formData.role === 'patient') {
      payload.dob = patientData.dateOfBirth;
      payload.address = "N/A"; // Modify if you collect address later
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error);
      alert(result.message || 'Registration successful!');
    } catch (err) {
      alert(err.message || 'Something went wrong');
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'doctor':
        return <DoctorFields data={doctorData} onChange={setDoctorData} />;
      case 'lab-technician':
        return <LabTechnicianFields data={labTechData} onChange={setLabTechData} />;
      case 'patient':
        return <PatientFields data={patientData} onChange={setPatientData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h2 className="form-title">Healthcare Registration</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          {errors.fullName && <p className="error-text">{errors.fullName}</p>}
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            required
          />
          {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
        </div>

        <div className="form-group">
          <label>User Role *</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="lab-technician">Lab Technician</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <PasswordStrengthMeter password={formData.password} />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
        </div>

        {renderRoleSpecificFields()}

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
            required
          />
          <label>I agree to the Terms & Conditions and Privacy Policy</label>
          {errors.terms && <p className="error-text">{errors.terms}</p>}
        </div>

        <button type="submit" className="submit-button">
          Create Healthcare Account
        </button>
      </form>
    </div>
  );
};

export default Register;
