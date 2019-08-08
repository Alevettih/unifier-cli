import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';
import { environment } from '@env/environment';
import { APP_CONFIG } from '@misc/constants';

if (environment.production) {
  enableProdMode();
}

fetch('/assets/config.json')
  .then((response: Response) => response.json())
  .then((config: object) => {
    if (environment.production) {
      enableProdMode();
    }

    platformBrowserDynamic([{ provide: APP_CONFIG, useValue: config }])
      .bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });
