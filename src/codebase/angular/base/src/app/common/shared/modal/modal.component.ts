import {
  Component,
  Inject,
  TemplateRef,
  Type,
  ViewContainerRef,
  Renderer2,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  ComponentRef
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IModalAction } from '@shared/modal/modal-actions/modal-actions.component';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface IModalComponentContext<T> {
  entity?: T;
  dialog?: MatDialogRef<any>;
}

export interface IModalFormComponent<T = any> {
  context: IModalComponentContext<T>;
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
  actions?: IModalAction[];
}

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent<T> implements AfterViewInit {
  @ViewChild('modalBody') modalBody: ElementRef<HTMLDivElement>;
  componentRef: ComponentRef<IModalFormComponent<T>>;

  get icon(): string {
    return this.data.icon ?? 'warning_amber';
  }

  get context(): IModalComponentContext<T> {
    return { ...this.data?.context, dialog: this._dialog };
  }

  get componentInstance(): IModalFormComponent<T> {
    return this.componentRef?.instance;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IModalData<T>,
    private _dialog: MatDialogRef<ModalComponent<T>>,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef
  ) {}

  ngAfterViewInit(): void {
    if (this.data.component) {
      this._createComponent();
    }
  }

  onSubmit(): void {
    this.componentInstance?.formGroup?.markAllAsTouched();
    this.componentInstance?.onSubmit?.();
  }

  private _createComponent(): void {
    this.componentRef = this._viewContainerRef.createComponent(this.data.component);
    this.componentRef.instance.context = this.context;
    this._renderer.appendChild(this.modalBody.nativeElement, this.componentRef.location.nativeElement);
    this._cdr.detectChanges();
  }
}
