import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { AppComponent } from './src/app/app.component';
import { APP_ROUTES } from './src/app.routes';
import { sessionInterceptor } from './src/app/core/auth/session.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES, withHashLocation()),
    provideHttpClient(
      withInterceptors([sessionInterceptor]) // 👈 É AQUI
    ),
  ],
}).catch(console.error);
