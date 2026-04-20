import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { credentialsInterceptor } from './core/interceptors';
import { apiResponseInterceptor } from './core/interceptors/api-response.interceptor';
import { AuthService } from './core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // Enables routing with the defined routes
    provideRouter(routes),
    
    // Configures HTTP client with interceptors to handle credentials and API responses
    provideHttpClient(
      withInterceptors([credentialsInterceptor, apiResponseInterceptor]),
    ),
    
    // Checks authentication status on app initialization before rendering, else it will navigate to login page by default even having a valid session
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      return auth.checkAuthOnInit();
    }),
    
    // Enables animations and configures Toast notifications
    importProvidersFrom([
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
        progressBar: true,
        closeButton: true,
      }),
    ]),
  ],
};
