import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@env/environment';
import { APP_CONFIG, AppConfig } from '@misc/constants';

if (environment.production) {
  enableProdMode();
}

fetch('/assets/config.json')
  .then((response: Response): Promise<AppConfig> => response.json())
  .then((config: AppConfig): void => {
    if (environment.production) {
      enableProdMode();
    }

    platformBrowserDynamic([{ provide: APP_CONFIG, useValue: config }])
      .bootstrapModule(AppModule)
      .catch((err: Error): void => console.error(err));
  });
