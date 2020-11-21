import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { iconsConfig } from '@services/icons/icons.config';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  private readonly iconsNames: Set<string> = new Set(iconsConfig);

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons(): void {
    this.iconsNames.forEach((name: string): void => {
      this.iconRegistry.addSvgIcon(name, this.sanitizer.bypassSecurityTrustResourceUrl(`assets/img/svg/${name}.svg`));
    });
  }
}
