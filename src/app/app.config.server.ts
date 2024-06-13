import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';
import { appConfig } from './app.config';
import { routes } from './app.routes';

const serverConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideServerRendering(),
   provideHttpClient() // add httpClientModule to the providers array
  ]
  
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
