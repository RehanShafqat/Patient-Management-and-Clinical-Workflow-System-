import { inject } from '@angular/core';
import {
  CanActivateChildFn,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

// Helper: Returns dashboard URL based on user role or redirects to login if not authenticated
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

// Verifies user is logged in AND has admin role; redirects otherwise
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  return getRoleDashboardUrl(authService, router);
};

// Verifies user is logged in AND has doctor role; redirects otherwise
export const doctorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isDoctor()) {
    return true;
  }

  return getRoleDashboardUrl(authService, router);
};

// Verifies user is logged in AND has FDO role; redirects otherwise
export const fdoGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isFdo()) {
    return true;
  }

  return getRoleDashboardUrl(authService, router);
};


// Child guards that apply the same logic to nested routes
export const adminChildGuard: CanActivateChildFn = (route, state) => {
  // route = the child route being accessed
  // state = the current router state (current URL, params, etc.)
  return adminGuard(route, state);
};
export const doctorChildGuard: CanActivateChildFn = (route, state) =>
  doctorGuard(route, state);
export const fdoChildGuard: CanActivateChildFn = (route, state) =>
  fdoGuard(route, state);
