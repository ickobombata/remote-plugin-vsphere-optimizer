/* Copyright (c) 2023 VMware, Inc. All rights reserved. */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
   console.log(environment);
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
   .catch(err => console.log(err));
