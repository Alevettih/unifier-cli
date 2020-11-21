import { formatDate, registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeEn, 'en');

export function dateFormatter(value: Date | string | number, format: string = 'dd-mm-yyyy HH:mm:ss', timezone?: string): string {
  return formatDate(value, format, 'en', timezone);
}
