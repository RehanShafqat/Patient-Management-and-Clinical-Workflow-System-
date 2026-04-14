import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { credentialsInterceptor } from './core/interceptors';
import { apiResponseInterceptor } from './core/interceptors/api-response.interceptor';
import { AuthService } from './core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([credentialsInterceptor, apiResponseInterceptor]),
    ),

    provideAppInitializer(() => {
      const auth = inject(AuthService);
      return auth.checkAuthOnInit();
    }),
  ],
};
