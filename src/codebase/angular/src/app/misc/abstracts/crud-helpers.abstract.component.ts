import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { IModalProperties, ModalService } from '@shared/modal/modal.service';

@Component({
  template: ''
})
export abstract class CrudHelpersAbstractComponent<T = any> implements OnDestroy {
  protected readonly _ACTION_MODAL_COMPONENT: any;
  protected readonly _MESSAGE_MODAL_COMPONENT: any;
  protected readonly _MODAL_OPTIONS: IModalProperties = {} as IModalProperties;
  protected readonly _DESTROYED$: Subject<void> = new Subject<void>();
  protected readonly _MODAL_NAMESPACE: string = '';

  protected get _namespace(): string {
    return this._MODAL_NAMESPACE ? `.${this._MODAL_NAMESPACE}` : '';
  }

  protected constructor(protected _modal: ModalService, protected _translate: TranslateService) {}

  ngOnDestroy(): void {
    this._DESTROYED$.next();
    this._DESTROYED$.complete();
  }

  onRemove(entity: T): void {
    this._openConfirmationModal()
      .pipe(switchMap((): Observable<void> => this._removeItem(entity)))
      .subscribe();
  }

  onCreate(): void {
    this._openCreateModal()
      .pipe(switchMap((entity: Partial<T>): Observable<T> => this._createItem(entity)))
      .subscribe();
  }

  onEdit(entity: T): void {
    this._openEditModal(entity)
      .pipe(switchMap((res: Partial<T>): Observable<T> => this._updateItem({ id: (entity as any)?.id, ...res })))
      .subscribe();
  }

  protected _openCreateModal(): Observable<Partial<T>> {
    const modalKey: string = `MODALS${this._namespace}.CREATE`;

    return this._modal.open<Partial<T>>(
      {
        title: this._translate.instant(`${modalKey}.TITLE`),
        component: this._ACTION_MODAL_COMPONENT
      },
      this._MODAL_OPTIONS
    );
  }

  protected _openEditModal(entity: T): Observable<Partial<T>> {
    const modalKey: string = `MODALS${this._namespace}.EDIT`;

    return this._modal.open<Partial<T>>(
      {
        title: this._translate.instant(`${modalKey}.TITLE`),
        component: this._ACTION_MODAL_COMPONENT,
        context: { entity }
      },
      this._MODAL_OPTIONS
    );
  }

  protected _openConfirmationModal(): Observable<boolean> {
    const modalKey: string = `MODALS${this._namespace}.REMOVE`;

    return this._modal.open<boolean>(
      {
        icon: 'attention',
        title: this._translate.instant(`${modalKey}.TITLE`),
        message:
          this._translate.instant(`${modalKey}.MESSAGE`) !== `${modalKey}.MESSAGE` ? this._translate.instant(`${modalKey}.MESSAGE`) : '',
        component: this._MESSAGE_MODAL_COMPONENT,
        context: {},
        actions: this._MESSAGE_MODAL_COMPONENT
          ? null
          : [
              { type: 'close', value: false, color: 'accent', name: this._translate.instant('BUTTON_NAME.NO') },
              { type: 'close', value: true, color: 'primary', name: this._translate.instant('BUTTON_NAME.YES') }
            ]
      },
      this._MODAL_OPTIONS
    );
  }

  protected _updateItem(entity: Partial<T>): Observable<T> {
    console.log(entity);
    throw new Error('Method not implemented');
  }

  protected _createItem(entity: Partial<T>): Observable<T> {
    console.log(entity);
    throw new Error('Method not implemented');
  }

  protected _removeItem(entity: T): Observable<void> {
    console.log(entity);
    throw new Error('Method not implemented');
  }
}
