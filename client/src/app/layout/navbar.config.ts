export interface NavItem {
  label: string;
  route: string;
  icon: string; // DaisyUI uses inline SVG or heroicons
}

export const NAV_ITEMS: Record<string, NavItem[]> = {
  admin: [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'grid' },
    { label: 'Manage Users', route: '/admin/create-user', icon: 'users' },
    { label: 'Patients', route: '/admin/patients', icon: 'person' },
    { label: 'Cases', route: '/admin/cases', icon: 'folder' },
    { label: 'Appointments', route: '/admin/appointments', icon: 'calendar' },
    { label: 'Visits', route: '/admin/visits', icon: 'clipboard' },
  ],

  doctor: [
    { label: 'Dashboard', route: '/doctor/dashboard', icon: 'grid' },
    {
      label: 'My Appointments',
      route: '/doctor/appointments',
      icon: 'calendar',
    },
    { label: 'My Visits', route: '/doctor/visits', icon: 'clipboard' },
    { label: 'Patients', route: '/doctor/patients', icon: 'person' },
  ],

  fdo: [
    { label: 'Dashboard', route: '/fdo/dashboard', icon: 'grid' },
    { label: 'Patients', route: '/fdo/patients', icon: 'person' },
    { label: 'Cases', route: '/fdo/cases', icon: 'folder' },
    { label: 'Appointments', route: '/fdo/appointments', icon: 'calendar' },
  ],
};
