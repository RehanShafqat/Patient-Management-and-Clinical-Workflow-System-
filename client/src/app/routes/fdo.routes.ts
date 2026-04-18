import { Routes } from '@angular/router';
import { appointmentCrudRoutes } from '../features/appointments/appointments.routes';
import { caseListAndDetailRoutes } from '../features/cases/cases.routes';
import { patientListAndDetailRoutes } from '../features/patients/patients.routes';

export const fdoChildRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../features/dashbaord/fdo-dashboard/fdo-dashboard.component').then(
        (m) => m.FdoDashboardComponent,
      ),
  },
  {
    path: 'patients',
    children: patientListAndDetailRoutes,
  },
  {
    path: 'cases',
    children: caseListAndDetailRoutes,
  },
  {
    path: 'appointments',
    children: appointmentCrudRoutes,
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
