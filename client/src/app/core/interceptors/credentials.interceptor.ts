import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // CLONE the original request because Angular HTTP requests are immutable (cannot be changed directly)
  // SET withCredentials to true to ensure cookies (JWT sessions) are sent automatically to the backend
  const clonedReq = req.clone({
    withCredentials: true,
  });

  // PASS the newly modified request forward to the next handler/backend
  return next(clonedReq);
};
