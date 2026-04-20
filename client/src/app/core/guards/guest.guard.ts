import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Prevents authenticated users from accessing guest-only pages (like login)
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Allow access if user is NOT logged in
  if (!authService.isLoggedIn()) {
    return true;
  }

  // Redirect logged-in users to their respective dashboards
  if (authService.isAdmin()) return router.parseUrl('/admin/dashboard');
  if (authService.isDoctor()) return router.parseUrl('/doctor/dashboard');
  if (authService.isFdo()) return router.parseUrl('/fdo/dashboard');

  return true;
};
