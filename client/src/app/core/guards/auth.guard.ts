import { inject } from '@angular/core';
import {
  CanActivateChildFn,
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FdoPermission } from '../constants/fdo-permissions';

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
  if (authService.isFdo())
    return router.parseUrl(authService.getFirstAllowedFdoRoute());

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

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  return getRoleDashboardUrl(authService, router);
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

const hasRoutePermission = (
  route: ActivatedRouteSnapshot,
  authService: AuthService,
): boolean => {
  if (!authService.isFdo()) {
    return true;
  }

  const requiredPermission = route.data?.['requiredPermission'] as
    | FdoPermission
    | undefined;

  const requiredAnyPermissions = route.data?.['requiredAnyPermissions'] as
    | FdoPermission[]
    | undefined;

  if (requiredAnyPermissions?.length) {
    return authService.hasAnyPermission(requiredAnyPermissions);
  }

  if (!requiredPermission) {
    return true;
  }

  return authService.hasPermission(requiredPermission);
};


// Child guards that apply the same logic to nested routes
export const adminChildGuard: CanActivateChildFn = (route, state) => {
  // route = the child route being accessed
  // state = the current router state (current URL, params, etc.)
  return adminGuard(route, state);
};
export const doctorChildGuard: CanActivateChildFn = (route, state) =>
  doctorGuard(route, state);
export const fdoChildGuard: CanActivateChildFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const roleCheck = fdoGuard(route, state);

  if (roleCheck !== true) {
    return roleCheck;
  }

  if (!hasRoutePermission(route, authService)) {
    return router.parseUrl(authService.getFirstAllowedFdoRoute());
  }

  return true;
};
