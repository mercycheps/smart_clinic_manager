import React from 'react';
import { useForm } from 'react-hook-form';

const DoctorForm = ({ initialData = {}, onSubmit, isLoading = false }) => {
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

  return (
    <div className="bg-white shadow-md rounded-xl p-8 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">
        {initialData.firstName ? 'Edit Doctor' : 'Add New Doctor'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              {...register('firstName', { required: 'First name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
              className="mt-1 w-full p-2 border rounded-md"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              {...register('lastName', { required: 'Last name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
              className="mt-1 w-full p-2 border rounded-md"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              })}
              className="mt-1 w-full p-2 border rounded-md"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              {...register('phoneNumber', {
                required: 'Phone number is required',
                minLength: { value: 10, message: 'Must be at least 10 digits' },
              })}
              className="mt-1 w-full p-2 border rounded-md"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Specialty</label>
            <select
              {...register('specialty', { required: 'Specialty is required' })}
              className="mt-1 w-full p-2 border rounded-md"
            >
              <option value="">Select specialty</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            {errors.specialty && <p className="text-red-500 text-sm">{errors.specialty.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">License Number</label>
            <input
              type="text"
              {...register('licenseNumber', { required: 'License number is required' })}
              className="mt-1 w-full p-2 border rounded-md"
            />
            {errors.licenseNumber && <p className="text-red-500 text-sm">{errors.licenseNumber.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Years of Experience</label>
          <input
            type="number"
            {...register('experience', { required: 'Experience is required' })}
            className="mt-1 w-full p-2 border rounded-md"
          />
          {errors.experience && <p className="text-red-500 text-sm">{errors.experience.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Education</label>
          <input
            type="text"
            {...register('education', { required: 'Education is required' })}
            className="mt-1 w-full p-2 border rounded-md"
          />
          {errors.education && <p className="text-red-500 text-sm">{errors.education.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Clinic Address</label>
          <input
            type="text"
            {...register('address', {
              required: 'Address is required',
              minLength: { value: 5, message: 'Min 5 characters' },
            })}
            className="mt-1 w-full p-2 border rounded-md"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Biography (optional)</label>
          <textarea
            {...register('bio')}
            rows={4}
            className="mt-1 w-full p-2 border rounded-md"
            placeholder="Brief doctor bio..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isLoading ? 'Saving...' : initialData.firstName ? 'Update Doctor' : 'Add Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
