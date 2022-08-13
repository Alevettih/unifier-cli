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
      .subscribe();
  }

  onCreate(): void {
    this.openCreateModal()
      .pipe(switchMap((entity: Partial<T>): Observable<T> => this.createItem(entity)))
      .subscribe();
  }

  onEdit(entity: T): void {
    this.openEditModal(entity)
      .pipe(switchMap((res: Partial<T>): Observable<T> => this.updateItem({ id: (entity as any)?.id, ...res })))
      .subscribe();
  }

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
        icon: 'attention',
        title: this.translate.instant(`${modalKey}.TITLE`),
        message:
          this.translate.instant(`${modalKey}.MESSAGE`) !== `${modalKey}.MESSAGE` ? this.translate.instant(`${modalKey}.MESSAGE`) : '',
        component: this.MESSAGE_MODAL_COMPONENT,
        context: {},
        actions: this.MESSAGE_MODAL_COMPONENT
          ? null
          : [
              { type: 'close', value: false, color: 'accent', name: this.translate.instant('BUTTON_NAME.NO') },
              { type: 'close', value: true, color: 'primary', name: this.translate.instant('BUTTON_NAME.YES') }
            ]
      },
      this.MODAL_OPTIONS
    );
  }

  protected updateItem(entity: Partial<T>): Observable<T> {
    console.log(entity);
    throw new Error('Method not implemented');
  }

  protected createItem(entity: Partial<T>): Observable<T> {
    console.log(entity);
    throw new Error('Method not implemented');
  }

  protected removeItem(entity: T): Observable<void> {
    console.log(entity);
    throw new Error('Method not implemented');
  }
}
