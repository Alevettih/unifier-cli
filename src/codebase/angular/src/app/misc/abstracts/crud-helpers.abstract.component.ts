import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { filter, switchMap } from 'rxjs/operators';
import { FormModalComponent } from '@modals/form-modal/form-modal.component';
import { IFormModalData } from '@models/interfaces/modals/form-modal-data.interface';
import { MessageModalComponent } from '@modals/message-modal/message-modal.component';
import { MessageModalType } from '@models/enums/message-modal-type.enum';
import { IMessageModalData } from '@models/interfaces/modals/message-modal-data.interface';
import { IFormControlItem } from '@models/interfaces/forms/form-control-item.interface';

@Component({
  template: ''
})
export abstract class CrudHelpersAbstractComponent<T = any> implements OnDestroy {
  protected readonly destroyed$: Subject<void> = new Subject<void>();

  constructor(
    protected dialog: MatDialog,
    protected translate: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onRemove(entity: T): void {
    this.openConfirmationModal()
      .pipe(switchMap((): Observable<void> => this.removeItem(entity)))
      .subscribe(this.onAfterRemove.bind(this));
  }

  onCreate(): void {
    this.openCreateModal()
      .pipe(switchMap((entity: Partial<T>): Observable<T> => this.createItem(entity)))
      .subscribe(this.onAfterCreate.bind(this));
  }

  onEdit(entity: T): void {
    this.openEditModal(entity)
      .pipe(switchMap((res: Partial<T>): Observable<T> => this.updateItem({ id: (entity as any)?.id, ...res })))
      .subscribe(this.onAfterEdit.bind(this));
  }

  // tslint:disable-next-line:no-empty
  onAfterRemove(...params: any[]): void {}

  // tslint:disable-next-line:no-empty
  onAfterCreate(...params: any[]): void {}

  // tslint:disable-next-line:no-empty
  onAfterEdit(...params: any[]): void {}

  protected openCreateModal(): Observable<Partial<T>> {
    const modalKey: string = 'MODAL.CREATE';

    return this.dialog
      .open(FormModalComponent, {
        data: {
          title: this.translate.instant(`${modalKey}.TITLE`),
          inputs: this.getModalInputs() ?? [],
          getRawValue: this.getFormRawValue
        } as IFormModalData
      })
      .afterClosed()
      .pipe(filter((res: Partial<T>): boolean => Boolean(res)));
  }

  protected openEditModal(entity: T): Observable<Partial<T>> {
    const modalKey: string = 'MODAL.EDIT';

    return this.dialog
      .open(FormModalComponent, {
        data: {
          title: this.translate.instant(`${modalKey}.TITLE`),
          inputs: this.getModalInputs(entity) ?? [],
          getRawValue: this.getFormRawValue
        } as IFormModalData
      })
      .afterClosed()
      .pipe(filter((res: Partial<T>): boolean => Boolean(res)));
  }

  protected openConfirmationModal(): Observable<boolean> {
    const modalKey: string = 'MODAL.REMOVE';

    return this.dialog
      .open(MessageModalComponent, {
        data: {
          title: this.translate.instant(`${modalKey}.TITLE`),
          message: this.translate.instant(`${modalKey}.MESSAGE`),
          type: MessageModalType.confirm
        } as IMessageModalData
      })
      .afterClosed()
      .pipe(filter((res: boolean): boolean => res));
  }

  protected updateItem(entity: Partial<T>): Observable<T> {
    throw new Error('Method not implemented');
  }

  protected createItem(entity: Partial<T>): Observable<T> {
    throw new Error('Method not implemented');
  }

  protected removeItem(entity: T): Observable<void> {
    throw new Error('Method not implemented');
  }

  protected abstract getModalInputs(entity?: T): IFormControlItem[];
  protected abstract getFormRawValue(fromValue: any): Partial<T>;
}
