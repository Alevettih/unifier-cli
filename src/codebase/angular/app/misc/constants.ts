import { InjectionToken } from '@angular/core';
import { Validators } from '@angular/forms';
import { CustomValidators } from '@misc/custom-validators';

export interface AppConfig {
  apiUrl: string;
  client_id: string;
  client_secret: string;
}

export const APP_CONFIG = new InjectionToken<string>('APP_CONFIG');

export const STORAGE_KEYS = Object.freeze({
  TOKENS: 'tokens',
  ROLE: 'role'
});

export const DEFAULT_PAGE_SIZE_OPTIONS = [20, 50, 100];
export const DEFAULT_PAGE_SIZE = DEFAULT_PAGE_SIZE_OPTIONS[0];

export const LANGUAGES = ['ua', 'ru'];
export const DEFAULT_LANGUAGE = LANGUAGES[0];

export const VALIDATORS_SET = Object.freeze({
  EMAIL: Validators.compose([Validators.email]),
  PASSWORD: Validators.compose([Validators.minLength(8), Validators.maxLength(30), CustomValidators.password])
});
