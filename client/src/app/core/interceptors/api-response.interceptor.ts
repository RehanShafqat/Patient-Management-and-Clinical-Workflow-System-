import {
  HttpContextToken,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { inject } from '@angular/core';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Token to optionally bypass the global error toast (first time login api call)
export const BYPASS_LOG_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  // INTERCEPT the HTTP stream. 'pipe' allows us to hook into the response before components get it.
  return next(req).pipe(

    // MAP: Runs when an API request matches SUCCESS (200 OK statuses)
    map((event: HttpEvent<unknown>) => {
      // Only process the actual completed HTTP Response (ignores progressing events)
      if (event instanceof HttpResponse && event.body) {
        const body = event.body as ApiResponse<unknown>;

        // Show a valid green success toast globally if the backend provided a 'message'
        if (body.message && body.message.trim() !== '') {
          toastService.success(body.message);
        }
      }
      return event;
    }),

    // CATCHERROR: Runs when an API request matches ERROR (400, 401, 500, etc statuses)
    catchError((error: any) => {
      // Check if this request explicitly opted out of error tracking
      if (!req.context.get(BYPASS_LOG_INTERCEPTOR)) {
        const message =
          error?.error?.message || error?.message || 'Something went wrong';

        // Show red error toast globally
        toastService.error(message);
      }

      // Re-throw the error so individual components still know the API call failed
      return throwError(() => error);
    }),
  );
};
