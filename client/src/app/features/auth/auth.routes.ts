import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
];
