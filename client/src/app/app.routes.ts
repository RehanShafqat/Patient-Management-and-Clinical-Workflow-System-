import { Routes } from '@angular/router';
import {
  authGuard,
  adminGuard,
  doctorGuard,
  fdoGuard,
} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  // Public — no guard
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },

  // Default redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Admin routes
  {
    path: 'admin',
    canActivate: [adminGuard],
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
      // {
      //     path: 'create-user',
      //     loadComponent: () =>
      //         import('./features/auth/create-user/create-user.component')
      //         .then(m => m.CreateUserComponent)
      // },
      // Add patients, cases, appointments here later
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Doctor routes
  {
    path: 'doctor',
    canActivate: [doctorGuard],
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
      // Add appointments, visits, patients here later
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // FDO routes
  {
    path: 'fdo',
    canActivate: [fdoGuard],
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
      // Add patients, cases, appointments here later
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Catch-all
  { path: '**', redirectTo: 'login' },
];
