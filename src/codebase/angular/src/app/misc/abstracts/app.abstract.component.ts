import { Component } from '@angular/core';
import { IconsService } from '@services/icons/icons.service';

@Component({
  template: ''
})
export abstract class AppAbstractComponent {
  constructor(private _icons: IconsService) {
    this._icons.registerIcons();
  }
}
