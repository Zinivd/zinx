
import { ApplicationConfig } from '@angular/core';
import { provideRouter }      from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HTTP_INTERCEPTORS }  from '@angular/common/http';
import { provideAnimations }  from '@angular/platform-browser/animations';
import { provideToastr }      from 'ngx-toastr';
import { routes }             from './app.routes';
import { AuthInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi:    true,
    },
    provideToastr({
      timeOut:          3000,
      positionClass:    'toast-top-right',
      preventDuplicates: true,
      progressBar:      true,
    }),
  ],
};
