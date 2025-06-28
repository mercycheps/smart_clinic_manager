import React from 'react';
import "./styles/doctor.css";

const DoctorFields = ({ data, onChange }) => {
  const specializations = [
    'General Medicine', 'Pediatrics', 'Surgery', 'Cardiology', 'Dermatology',
    'Neurology', 'Orthopedics', 'Psychiatry', 'Radiology', 'Emergency Medicine'
  ];

  const scheduleOptions = [
    'Monday Morning', 'Monday Afternoon', 'Tuesday Morning', 'Tuesday Afternoon',
    'Wednesday Morning', 'Wednesday Afternoon', 'Thursday Morning', 'Thursday Afternoon',
    'Friday Morning', 'Friday Afternoon', 'Saturday Morning', 'Sunday Morning'
  ];

  const handleScheduleChange = (schedule, checked) => {
    const newSchedule = checked
      ? [...data.workSchedule, schedule]
      : data.workSchedule.filter(s => s !== schedule);

    onChange({ ...data, workSchedule: newSchedule });
  };

  return (
    <div className="doctor-container">
      <h3 className="doctor-title">🩺 Doctor Information</h3>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="medicalLicense">Medical License Number *</label>
          <input
            type="text"
            id="medicalLicense"
            value={data.medicalLicenseNumber}
            onChange={(e) => onChange({ ...data, medicalLicenseNumber: e.target.value })}
            placeholder="Enter license number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="specialization">Specialization *</label>
          <select
            id="specialization"
            value={data.specialization}
            onChange={(e) => onChange({ ...data, specialization: e.target.value })}
            required
          >
            <option value="">Select specialization</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="experience">Years of Experience *</label>
          <input
            type="number"
            id="experience"
            min="0"
            max="50"
            value={data.yearsOfExperience}
            onChange={(e) => onChange({ ...data, yearsOfExperience: parseInt(e.target.value) || 0 })}
            placeholder="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="clinic">Clinic/Hospital Name *</label>
          <input
            type="text"
            id="clinic"
            value={data.clinicName}
            onChange={(e) => onChange({ ...data, clinicName: e.target.value })}
            placeholder="Enter clinic or hospital name"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Work Schedule Availability *</label>
        <div className="schedule-grid">
          {scheduleOptions.map((schedule) => (
            <div key={schedule} className="checkbox-group">
              <input
                type="checkbox"
                id={schedule}
                checked={data.workSchedule.includes(schedule)}
                onChange={(e) => handleScheduleChange(schedule, e.target.checked)}
              />
              <label htmlFor={schedule}>{schedule}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorFields;
