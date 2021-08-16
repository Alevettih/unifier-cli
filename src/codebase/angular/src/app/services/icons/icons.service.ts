import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { SafeResourceUrlWithIconOptions } from '@angular/material/icon/icon-registry';
import { APP_CONFIG, IAppConfig } from '@misc/constants/app-config.constant';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  constructor(
    private _iconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private _platformId: object,
    @Inject(APP_CONFIG) private _config: IAppConfig
  ) {
    this._iconRegistry.addSvgIconResolver((name: string, namespace: string): SafeResourceUrl | SafeResourceUrlWithIconOptions | null => {
      const path: string = `assets/img/svg/${namespace ? `${namespace}/` : ''}${name}.svg`;

      return this._sanitizer.bypassSecurityTrustResourceUrl(
        isPlatformServer(this._platformId) ? `${this._config.originUrl}/${path}` : `./${path}`
      );
    });
  }
}
