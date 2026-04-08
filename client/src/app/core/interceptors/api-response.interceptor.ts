import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { ToastService } from '../services/toast/toast.service';
import { inject } from '@angular/core';
import { ApiResponse } from '../models';
export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  return next(req).pipe(
    map((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse && event.body) {
        const body = event.body as ApiResponse<unknown>;
        if (body.message && !(body.message == ''))
          toastService.success(body.message);
      }
      return event;
    }),
    catchError((error: any) => {
      const message =
        error?.error?.message || error?.message || 'Something went wrong';
      toastService.error(message);
      return throwError(() => error);
    }),
  );
};
