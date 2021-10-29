import { Component, Inject, InjectionToken, Injector, TemplateRef, Type, ValueProvider } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserModalComponent } from '@shared/modal/modals/user-modal/user-modal.component';

export const COMPONENT_CONTEXT: InjectionToken<string> = new InjectionToken<string>('COMPONENT_CONTEXT');

export interface IModalComponentContext<T> {
  entity?: T;
  dialog?: MatDialogRef<any>;
  [key: string]: any;
}

export interface IModalData<T> {
  title?: string;
  icon?: string;
  template?: TemplateRef<any>;
  component?: Type<UserModalComponent>;
  context?: IModalComponentContext<T>;
}

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent<T> {
  injector: Injector;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IModalData<T>,
    private _dialog: MatDialogRef<ModalComponent<T>>,
    private _injector: Injector
  ) {
    this.injector = Injector.create({
      providers: [{ provide: COMPONENT_CONTEXT, useValue: this.context, multi: false } as ValueProvider],
      parent: _injector
    });
  }

  get src(): string {
    return this._getIconPath();
  }

  get srcset(): string {
    return [this._getIconPath(), this._getIconPath('2x'), this._getIconPath('3x')].join(', ');
  }

  get icon(): string {
    return this.data.icon ?? 'name';
  }

  get context(): IModalComponentContext<T> {
    return { ...this.data?.context, dialog: this._dialog };
  }

  private _getIconPath(size?: string): string {
    return `/assets/img/modal-icons/${this.icon}/${this.icon}${size ? `@${size}` : ''}.png ${size ?? ''}`.trim();
  }
}
