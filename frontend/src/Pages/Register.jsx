import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
    'Internal Medicine', 'Cardiology', 'Dermatology', 'Emergency Medicine',
    'Family Medicine', 'Neurology', 'Oncology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery', 'Urology',
  ];

  const handleRegister = async (data) => {
    console.log('Submitted Doctor Data:', data);
    navigate('/doctor');
  };

  return (
    <div className="register-container">
      <h2 className="register-title">
        {initialData.firstName ? 'Edit Doctor' : 'Add New Doctor'}
      </h2>

      <form onSubmit={handleSubmit(handleRegister)} className="register-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            {...register('firstName', { required: 'First name is required' })}
          />
          {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            {...register('lastName', { required: 'Last name is required' })}
          />
          {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            type="tel"
            {...register('phoneNumber', { required: 'Phone number is required' })}
          />
          {errors.phoneNumber && <p className="error-message">{errors.phoneNumber.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="specialty">Specialty</label>
          <select id="specialty" {...register('specialty', { required: 'Specialty is required' })}>
            <option value="">Select Specialty</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          {errors.specialty && <p className="error-message">{errors.specialty.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="licenseNumber">License Number</label>
          <input
            id="licenseNumber"
            {...register('licenseNumber', { required: 'License number is required' })}
          />
          {errors.licenseNumber && <p className="error-message">{errors.licenseNumber.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience</label>
          <input
            id="experience"
            type="number"
            {...register('experience', { required: 'Experience is required' })}
          />
          {errors.experience && <p className="error-message">{errors.experience.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="education">Education</label>
          <input
            id="education"
            {...register('education', { required: 'Education is required' })}
          />
          {errors.education && <p className="error-message">{errors.education.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            {...register('address', { required: 'Address is required' })}
          />
          {errors.address && <p className="error-message">{errors.address.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            {...register('bio', { required: 'Bio is required' })}
          ></textarea>
          {errors.bio && <p className="error-message">{errors.bio.message}</p>}
        </div>

        <div className="register-actions">
          <button type="button" className="register-cancel-button">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="register-submit-button"
          >
            {isLoading ? 'Saving...' : initialData.firstName ? 'Update Doctor' : 'Add Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;