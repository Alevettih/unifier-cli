import { Component, Inject, InjectionToken, Injector, TemplateRef, Type, OnInit, ValueProvider, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IModalAction } from '@shared/modal/modal-actions/modal-actions.component';
import { FormBuilder, FormGroup } from '@angular/forms';

export const COMPONENT_CONTEXT: InjectionToken<string> = new InjectionToken<string>('COMPONENT_CONTEXT');

export interface IModalComponentContext<T> {
  entity?: T;
  dialog?: MatDialogRef<any>;
  [key: string]: any;
}

export interface IModalFormComponent {
  formGroup: FormGroup;
  onSubmit(): void;
}

export interface IModalData<T = any> {
  icon?: string;
  title?: string;
  message?: string;
  template?: TemplateRef<any>;
  component?: Type<IModalFormComponent>;
  context?: IModalComponentContext<T>;
  actions?: IModalAction<T>[];
}

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent<T> implements OnInit {
  injector: Injector;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IModalData<T>,
    private _dialog: MatDialogRef<ModalComponent<T>>,
    private _injector: Injector,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.injector = Injector.create({
      providers: [{ provide: COMPONENT_CONTEXT, useValue: this.context, multi: false } as ValueProvider],
      parent: this._injector
    });
  }

  get icon(): string {
    return this.data.icon ?? 'warning_amber';
  }

  get context(): IModalComponentContext<T> {
    return { ...this.data?.context, dialog: this._dialog };
  }

  private _getIconPath(size?: string): string {
    return `/assets/img/modal-icons/${this.icon}/${this.icon}${size ? `@${size}` : ''}.png ${size ?? ''}`.trim();
  }
}
