import { ApplicationConfig } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Enable HttpClient throughout the app
    importProvidersFrom(HttpClientModule),
    // Set up the router with our routes//
    provideRouter(routes)
  ]
};
