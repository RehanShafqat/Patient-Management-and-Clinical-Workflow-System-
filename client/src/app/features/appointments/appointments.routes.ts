import { Routes } from '@angular/router';

export const appointmentCrudRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./appointment-list/appointment-list.component').then(
        (m) => m.AppointmentListComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./appointment-create/appointment-create.component').then(
        (m) => m.AppointmentCreateComponent,
      ),
  },
  {
    path: 'form',
    redirectTo: 'new',
    pathMatch: 'full',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./appointment-detail/appointment-detail.component').then(
        (m) => m.AppointmentDetailComponent,
      ),
  },
];

export const appointmentListAndDetailRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./appointment-list/appointment-list.component').then(
        (m) => m.AppointmentListComponent,
      ),
  },
  {
    path: 'new',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'form',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./appointment-detail/appointment-detail.component').then(
        (m) => m.AppointmentDetailComponent,
      ),
  },
];
