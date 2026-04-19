import { Routes } from '@angular/router';
import { appointmentCrudRoutes } from '../features/appointments/appointments.routes';
import { caseListAndDetailRoutes } from '../features/cases/cases.routes';
import { patientListAndDetailRoutes } from '../features/patients/patients.routes';
import { FDO_PERMISSIONS } from '../core/constants/fdo-permissions';

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
    data: {
      requiredPermission: FDO_PERMISSIONS.VIEW_PATIENTS,
    },
    children: patientListAndDetailRoutes,
  },
  {
    path: 'cases',
    data: {
      requiredPermission: FDO_PERMISSIONS.VIEW_CASES,
    },
    children: caseListAndDetailRoutes,
  },
  {
    path: 'appointments',
    data: {
      requiredAnyPermissions: [
        FDO_PERMISSIONS.VIEW_APPOINTMENTS,
        FDO_PERMISSIONS.CREATE_APPOINTMENT,
        FDO_PERMISSIONS.UPDATE_APPOINTMENT,
      ],
    },
    children: appointmentCrudRoutes,
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
