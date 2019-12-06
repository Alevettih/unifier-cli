import { InjectionToken } from '@angular/core';

export interface AppConfig {
  ApiUrl: string;
}

export const APP_CONFIG = new InjectionToken<string>('APP_CONFIG');
