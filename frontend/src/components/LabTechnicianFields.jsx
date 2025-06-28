import React from 'react';
import "./styles/doctor.css";

const LabTechnicianFields = ({ data, onChange }) => {
  const departments = [
    'Radiology', 'Pathology', 'Hematology', 'Microbiology',
    'Biochemistry', 'Immunology', 'Cytology', 'Histology'
  ];

  const shifts = [
    'Day Shift (8AM - 4PM)',
    'Evening Shift (4PM - 12AM)',
    'Night Shift (12AM - 8AM)',
    'Rotating Shifts'
  ];

  return (
    <div className="labtech-container">
      <h3 className="labtech-title">🧪 Lab Technician Information</h3>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="certificationId">Certification ID/Number *</label>
          <input
            type="text"
            id="certificationId"
            value={data.certificationId}
            onChange={(e) => onChange({ ...data, certificationId: e.target.value })}
            placeholder="Enter certification number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Assigned Department *</label>
          <select
            id="department"
            value={data.assignedDepartment}
            onChange={(e) => onChange({ ...data, assignedDepartment: e.target.value })}
            required
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="workShift">Work Shift/Availability *</label>
          <select
            id="workShift"
            value={data.workShift}
            onChange={(e) => onChange({ ...data, workShift: e.target.value })}
            required
          >
            <option value="">Select work shift</option>
            {shifts.map((shift) => (
              <option key={shift} value={shift}>{shift}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LabTechnicianFields;
