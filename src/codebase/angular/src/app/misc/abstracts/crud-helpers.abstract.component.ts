import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { IModalProperties, ModalService } from '@shared/modal/modal.service';

@Component({
  template: ''
})
export abstract class CrudHelpersAbstractComponent<T = any> implements OnDestroy {
  protected readonly ACTION_MODAL_COMPONENT: any;
  protected readonly MESSAGE_MODAL_COMPONENT: any;
  protected readonly MODAL_OPTIONS: IModalProperties = {};
  protected readonly DESTROYED$: Subject<void> = new Subject<void>();
  protected readonly MODAL_NAMESPACE: string = '';

  constructor(protected modal: ModalService, protected translate: TranslateService) {}

  ngOnDestroy(): void {
    this.DESTROYED$.next();
    this.DESTROYED$.complete();
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

  protected get namespace(): string {
    return this.MODAL_NAMESPACE ? `.${this.MODAL_NAMESPACE}` : '';
  }

  protected openCreateModal(): Observable<Partial<T>> {
    const modalKey: string = `MODALS${this.namespace}.CREATE`;

    return this.modal.open<Partial<T>>(
      {
        title: this.translate.instant(`${modalKey}.TITLE`),
        component: this.ACTION_MODAL_COMPONENT
      },
      this.MODAL_OPTIONS
    );
  }

  protected openEditModal(entity: T): Observable<Partial<T>> {
    const modalKey: string = `MODALS${this.namespace}.EDIT`;

    return this.modal.open<Partial<T>>(
      {
        title: this.translate.instant(`${modalKey}.TITLE`),
        component: this.ACTION_MODAL_COMPONENT,
        context: { entity }
      },
      this.MODAL_OPTIONS
    );
  }

  protected openConfirmationModal(): Observable<boolean> {
    const modalKey: string = `MODALS${this.namespace}.REMOVE`;

    return this.modal.open<boolean>(
      {
        title: this.translate.instant(`${modalKey}.TITLE`),
        component: this.MESSAGE_MODAL_COMPONENT
      },
      this.MODAL_OPTIONS
    );
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
}
