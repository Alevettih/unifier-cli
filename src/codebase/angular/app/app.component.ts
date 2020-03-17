import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly iconsNames: string[] = [];

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.registerIcons();
  }
  registerIcons(): void {
    this.iconsNames.forEach((name: string): void => {
      this.iconRegistry.addSvgIcon(name, this.sanitizer.bypassSecurityTrustResourceUrl(`assets/img/svg/${name}.svg`));
    });
  }
}
