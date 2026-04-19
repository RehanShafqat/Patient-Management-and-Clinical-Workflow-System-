export const FDO_PERMISSIONS = {
  VIEW_PATIENTS: 'view_patients',
  CREATE_PATIENT: 'create_patient',
  UPDATE_PATIENT: 'update_patient',

  VIEW_CASES: 'view_cases',
  CREATE_CASE: 'create_case',
  UPDATE_CASE: 'update_case',

  VIEW_APPOINTMENTS: 'view_appointments',
  CREATE_APPOINTMENT: 'create_appointment',
  UPDATE_APPOINTMENT: 'update_appointment',

  VIEW_DOCTORS: 'view_doctors',

  // Legacy compatibility for previously seeded permission values.
  LEGACY_VIEW_DOCTOR_SCHEDULES: 'view_doctor_schedules',

  EXPORT_PATIENTS: 'export_patients',
  EXPORT_CASES: 'export_cases',
  EXPORT_APPOINTMENTS: 'export_appointments',
} as const;

export type FdoPermission =
  (typeof FDO_PERMISSIONS)[keyof typeof FDO_PERMISSIONS];
