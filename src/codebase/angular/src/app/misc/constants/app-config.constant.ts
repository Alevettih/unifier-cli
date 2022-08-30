import { InjectionToken } from '@angular/core';

export interface IAppConfig {
  apiUrl: string;
  originUrl: string;
  client_id: string;
  client_secret: string;
}

export const APP_CONFIG: InjectionToken<string> = new InjectionToken<string>('APP_CONFIG');
