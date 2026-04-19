export interface NavItem {
  label: string;
  route: string;
  icon: string;
}

export const NAV_ITEMS: Record<string, NavItem[]> = {
  admin: [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'grid_view' },
    { label: 'FDOs', route: '/admin/fdo', icon: 'person' },
    { label: 'Doctors', route: '/admin/doctors', icon: 'person' },
    {
      label: 'Specialties',
      route: '/admin/specialties',
      icon: 'medical_services',
    },
    {
      label: 'Insurances',
      route: '/admin/insurances',
      icon: 'shield',
    },
    { label: 'Patients', route: '/admin/patients', icon: 'person' },
    { label: 'Cases', route: '/admin/cases', icon: 'folder' },
    {
      label: 'Appointments',
      route: '/admin/appointments',
      icon: 'calendar_month',
    },
    { label: 'Visits', route: '/admin/visits', icon: 'assignment' },
  ],

  doctor: [
    { label: 'Dashboard', route: '/doctor/dashboard', icon: 'grid_view' },
    {
      label: 'My Appointments',
      route: '/doctor/appointments',
      icon: 'calendar_month',
    },
    { label: 'My Visits', route: '/doctor/visits', icon: 'assignment' },
    { label: 'Patients', route: '/doctor/patients', icon: 'person' },
  ],

  fdo: [
    { label: 'Dashboard', route: '/fdo/dashboard', icon: 'grid_view' },
    { label: 'Patients', route: '/fdo/patients', icon: 'person' },
    { label: 'Cases', route: '/fdo/cases', icon: 'folder' },
    {
      label: 'Appointments',
      route: '/fdo/appointments',
      icon: 'calendar_month',
    },
  ],
};
