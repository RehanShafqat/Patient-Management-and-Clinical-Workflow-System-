import { Routes } from '@angular/router';
import {
  authGuard,
  adminGuard,
  adminChildGuard,
  doctorGuard,
  doctorChildGuard,
  fdoGuard,
  fdoChildGuard,
} from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/landing/landing.component').then(
        (m) => m.LandingComponent,
      ),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  //INFO: Admin routes
  {
    path: 'admin',
    canActivate: [adminGuard],
    canActivateChild: [adminChildGuard],
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashbaord/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'create-user',
        loadComponent: () =>
          import('./features/admin/create-user/create-user.component').then(
            (m) => m.CreateUserComponent,
          ),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./features/patients/patient-list/patient-list.component').then(
            (m) => m.PatientListComponent,
          ),
      },
      {
        path: 'patients/new',
        loadComponent: () =>
          import('./features/patients/patient-create/patient-create.component').then(
            (m) => m.PatientCreateComponent,
          ),
      },
      {
        path: 'patients/form',
        redirectTo: 'patients/new',
        pathMatch: 'full',
      },
      {
        path: 'patients/:id',
        loadComponent: () =>
          import('./features/patients/patient-detail/patient-detail.component').then(
            (m) => m.PatientDetailComponent,
          ),
      },
      {
        path: 'cases/new',
        loadComponent: () =>
          import('./features/cases/case-create/case-create.component').then(
            (m) => m.CaseCreateComponent,
          ),
      },
      {
        path: 'cases',
        loadComponent: () =>
          import('./features/cases/case-list/case-list.component').then(
            (m) => m.CaseListComponent,
          ),
      },
      {
        path: 'cases/:id',
        loadComponent: () =>
          import('./features/cases/case-detail/case-detail.component').then(
            (m) => m.CaseDetailComponent,
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./features/appointments/appointment-list/appointment-list.component').then(
            (m) => m.AppointmentListComponent,
          ),
      },
      {
        path: 'appointments/new',
        loadComponent: () =>
          import('./features/appointments/appointment-create/appointment-create.component').then(
            (m) => m.AppointmentCreateComponent,
          ),
      },
      {
        path: 'appointments/form',
        redirectTo: 'appointments/new',
        pathMatch: 'full',
      },
      {
        path: 'appointments/:id',
        loadComponent: () =>
          import('./features/appointments/appointment-detail/appointment-detail.component').then(
            (m) => m.AppointmentDetailComponent,
          ),
      },
      {
        path: 'visits',
        loadComponent: () =>
          import('./features/visits/visit-list/visit-list.component').then(
            (m) => m.VisitListComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  //INFO: Doctor routes
  {
    path: 'doctor',
    canActivate: [doctorGuard],
    canActivateChild: [doctorChildGuard],
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashbaord/doctor-dashboard/doctor-dashboard.component').then(
            (m) => m.DoctorDashboardComponent,
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./features/appointments/appointment-list/appointment-list.component').then(
            (m) => m.AppointmentListComponent,
          ),
      },
      {
        path: 'appointments/new',
        loadComponent: () =>
          import('./features/appointments/appointment-create/appointment-create.component').then(
            (m) => m.AppointmentCreateComponent,
          ),
      },
      {
        path: 'appointments/form',
        redirectTo: 'appointments/new',
        pathMatch: 'full',
      },
      {
        path: 'appointments/:id',
        loadComponent: () =>
          import('./features/appointments/appointment-detail/appointment-detail.component').then(
            (m) => m.AppointmentDetailComponent,
          ),
      },
      {
        path: 'visits',
        loadComponent: () =>
          import('./features/visits/visit-list/visit-list.component').then(
            (m) => m.VisitListComponent,
          ),
      },
      {
        path: 'cases/:id',
        loadComponent: () =>
          import('./features/cases/case-detail/case-detail.component').then(
            (m) => m.CaseDetailComponent,
          ),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./features/patients/patient-list/patient-list.component').then(
            (m) => m.PatientListComponent,
          ),
      },
      {
        path: 'patients/:id',
        loadComponent: () =>
          import('./features/patients/patient-detail/patient-detail.component').then(
            (m) => m.PatientDetailComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  //INFO: FDO routes
  {
    path: 'fdo',
    canActivate: [fdoGuard],
    canActivateChild: [fdoChildGuard],
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashbaord/fdo-dashboard/fdo-dashboard.component').then(
            (m) => m.FdoDashboardComponent,
          ),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./features/patients/patient-list/patient-list.component').then(
            (m) => m.PatientListComponent,
          ),
      },
      {
        path: 'patients/:id',
        loadComponent: () =>
          import('./features/patients/patient-detail/patient-detail.component').then(
            (m) => m.PatientDetailComponent,
          ),
      },
      {
        path: 'cases',
        loadComponent: () =>
          import('./features/cases/case-list/case-list.component').then(
            (m) => m.CaseListComponent,
          ),
      },
      {
        path: 'cases/:id',
        loadComponent: () =>
          import('./features/cases/case-detail/case-detail.component').then(
            (m) => m.CaseDetailComponent,
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./features/appointments/appointment-list/appointment-list.component').then(
            (m) => m.AppointmentListComponent,
          ),
      },
      {
        path: 'appointments/new',
        loadComponent: () =>
          import('./features/appointments/appointment-create/appointment-create.component').then(
            (m) => m.AppointmentCreateComponent,
          ),
      },
      {
        path: 'appointments/form',
        redirectTo: 'appointments/new',
        pathMatch: 'full',
      },
      {
        path: 'appointments/:id',
        loadComponent: () =>
          import('./features/appointments/appointment-detail/appointment-detail.component').then(
            (m) => m.AppointmentDetailComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
