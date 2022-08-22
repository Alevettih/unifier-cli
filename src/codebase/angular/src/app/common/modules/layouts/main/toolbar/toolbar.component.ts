import { Component, TemplateRef } from '@angular/core';
import { ToolbarHelperService } from '@services/toolbar-helper/toolbar-helper.service';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  get template(): TemplateRef<any> {
    return this._toolbarHelper.template;
  }

  get templateData(): any {
    return this._toolbarHelper.templateData;
  }

  get isHidden(): any {
    return this._toolbarHelper.isHidden;
  }

  constructor(private _toolbarHelper: ToolbarHelperService) {}
}
