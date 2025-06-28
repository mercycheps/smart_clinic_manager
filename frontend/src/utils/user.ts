export type UserRole = 'patient' | 'doctor' | 'lab-technician' | 'admin';

export interface BaseUser {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  termsAccepted: boolean;
}

export interface DoctorData {
  medicalLicenseNumber: string;
  specialization: string;
  yearsOfExperience: number;
  clinicName: string;
  workSchedule: string[];
}

export interface LabTechnicianData {
  certificationId: string;
  assignedDepartment: string;
  workShift: string;
}

export interface PatientData {
  dateOfBirth: string;
  gender: string;
  medicalHistory?: string;
  insuranceProvider?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface RegistrationData extends BaseUser {
  doctorData?: DoctorData;
  labTechnicianData?: LabTechnicianData;
  patientData?: PatientData;
}
