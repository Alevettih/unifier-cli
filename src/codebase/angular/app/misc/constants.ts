import { InjectionToken } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { CustomValidators } from '@misc/custom-validators';

export interface AppConfig {
  apiUrl: string;
  client_id: string;
  client_secret: string;
}

export const APP_CONFIG: InjectionToken<string> = new InjectionToken<string>('APP_CONFIG');

export const STORAGE_KEYS: Readonly<{ TOKENS: string; ROLE: string }> = Object.freeze({
  TOKENS: 'tokens',
  ROLE: 'role'
});

export const DEFAULT_PAGE_SIZE_OPTIONS: number[] = [20, 50, 100];
export const DEFAULT_PAGE_SIZE: number = DEFAULT_PAGE_SIZE_OPTIONS[0];

export const LANGUAGES: string[] = ['en'];
export const DEFAULT_LANGUAGE: string = LANGUAGES[0];

export const VALIDATORS_SET: {
  EMAIL: ValidatorFn;
  PASSWORD: ValidatorFn;
} = Object.freeze({
  EMAIL: Validators.compose([Validators.email]),
  PASSWORD: Validators.compose([Validators.minLength(8), Validators.maxLength(30), CustomValidators.password])
});
