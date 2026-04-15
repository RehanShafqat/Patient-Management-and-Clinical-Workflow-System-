export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type PatientStatus = 'active' | 'inactive' | 'deceased' | 'transferred';

export interface Patient {
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  ssn?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  country?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  primary_physician?: string | null;
  insurance_provider?: string | null;
  insurance_policy_number?: string | null;
  preferred_language?: string;
  patient_status: PatientStatus;
  registration_date: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CreatePatientPayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  ssn: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  primary_physician?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  preferred_language?: string;
  patient_status: PatientStatus;
  registration_date?: string;
}

export interface CreatePatientResponse {
  patient: Patient;
}
