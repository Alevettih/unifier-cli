import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { iconsConfig } from '@services/icons/icons.config';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  private readonly _iconsNames: Set<string> = new Set(iconsConfig);

  constructor(private _iconRegistry: MatIconRegistry, private _sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons(): void {
    this._iconsNames.forEach((name: string): void => {
      this._iconRegistry.addSvgIcon(name, this._sanitizer.bypassSecurityTrustResourceUrl(`assets/img/svg/${name}.svg`));
    });
  }
}
