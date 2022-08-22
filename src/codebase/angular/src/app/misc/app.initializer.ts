import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function AppInitializerFactory(translate: TranslateService): () => void {
  return (): void => {
    const languages: string[] = ['en'];
    const browserLang: string = translate.getBrowserLang();

    translate.addLangs(languages);
    translate.setDefaultLang('en');

    translate.use(browserLang.match(/en/) ? browserLang : 'en');
  };
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json?cb=' + new Date().getTime());
}
