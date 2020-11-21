import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@env/environment';
import { APP_CONFIG, IAppConfig } from '@misc/constants/app-config.constant';

if (environment.production) {
  enableProdMode();
}

fetch('/assets/token.json')
  .then((response: Response): Promise<string> => response.json())
  .then((response: string): IAppConfig => JSON.parse(atob(response.split('').reverse().join(''))))
  .then((config: IAppConfig): void => {
    if (environment.production) {
      enableProdMode();
    }

    platformBrowserDynamic([{ provide: APP_CONFIG, useValue: config }])
      .bootstrapModule(AppModule)
      .catch((err: Error): void => console.error(err));
  })
  .catch((err: Error): void => console.error('Wrong token or token encoding: ', err));
