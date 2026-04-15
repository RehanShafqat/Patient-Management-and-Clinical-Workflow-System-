import { inject } from '@angular/core';
import {
  CanActivateChildFn,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

const getRoleDashboardUrl = (
  authService: AuthService,
  router: Router,
): UrlTree => {
  if (!authService.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  if (authService.isAdmin()) return router.parseUrl('/admin/dashboard');
  if (authService.isDoctor()) return router.parseUrl('/doctor/dashboard');
  if (authService.isFdo()) return router.parseUrl('/fdo/dashboard');

  return router.parseUrl('/login');
};

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/login');
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  return getRoleDashboardUrl(authService, router);
};

export const doctorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isDoctor()) {
    return true;
  }

  return getRoleDashboardUrl(authService, router);
};

export const fdoGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isFdo()) {
    return true;
  }

  return getRoleDashboardUrl(authService, router);
};

export const adminChildGuard: CanActivateChildFn = (route, state) =>
  adminGuard(route, state);
export const doctorChildGuard: CanActivateChildFn = (route, state) =>
  doctorGuard(route, state);
export const fdoChildGuard: CanActivateChildFn = (route, state) =>
  fdoGuard(route, state);
