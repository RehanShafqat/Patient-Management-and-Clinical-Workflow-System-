import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  if (authService.isAdmin()) return router.parseUrl('/admin/dashboard');
  if (authService.isDoctor()) return router.parseUrl('/doctor/dashboard');
  if (authService.isFdo()) return router.parseUrl('/fdo/dashboard');

  return true;
};
