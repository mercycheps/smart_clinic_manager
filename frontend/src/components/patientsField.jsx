import React from 'react';
import "./styles/doctor.css";

const PatientFields = ({ data, onChange }) => {
  const insuranceProviders = [
    'Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Humana', 'Kaiser Permanente',
    'Medicare', 'Medicaid', 'United Healthcare', 'Other', 'None'
  ];

  return (
    <div className="patient-container">
      <h3 className="patient-header">🧍 Patient Information</h3>
      
      <div className="patient-grid">
        <div className="input-group">
          <label htmlFor="dateOfBirth">Date of Birth *</label>
          <input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            value={data.gender}
            onChange={(e) => onChange({ ...data, gender: e.target.value })}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="insuranceProvider">Insurance Provider</label>
          <select
            id="insuranceProvider"
            value={data.insuranceProvider}
            onChange={(e) => onChange({ ...data, insuranceProvider: e.target.value })}
          >
            <option value="">Select insurance provider</option>
            {insuranceProviders.map((provider) => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="emergencyContactName">Emergency Contact Name *</label>
          <input
            id="emergencyContactName"
            value={data.emergencyContactName}
            onChange={(e) => onChange({ ...data, emergencyContactName: e.target.value })}
            placeholder="Enter emergency contact name"
            required
          />
        </div>

        <div className="input-group full-width">
          <label htmlFor="emergencyContactPhone">Emergency Contact Phone *</label>
          <input
            id="emergencyContactPhone"
            type="tel"
            value={data.emergencyContactPhone}
            onChange={(e) => onChange({ ...data, emergencyContactPhone: e.target.value })}
            placeholder="Enter emergency contact phone"
            required
          />
        </div>

        <div className="input-group full-width">
          <label htmlFor="medicalHistory">Medical History Summary (Optional)</label>
          <textarea
            id="medicalHistory"
            value={data.medicalHistory || ''}
            onChange={(e) => onChange({ ...data, medicalHistory: e.target.value })}
            placeholder="Brief summary of relevant medical history, allergies, current medications..."
            rows="4"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default PatientFields;
