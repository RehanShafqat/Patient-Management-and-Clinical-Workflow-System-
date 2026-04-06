// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // {
  //   path: 'admin',
  //   canActivate: [adminGuard],
  //   children: [
  //     // admin routes here (e.g., create-user if admin-only)
  //     { path: 'create-user', loadChildren: () => import('./features/auth/create-user/create-user.component').then(m => m.CreateUserComponent) }
  //   ]
  // },

  { path: '**', redirectTo: 'auth/login' }
];