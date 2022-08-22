import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IModalData, ModalComponent } from '@shared/modal/modal.component';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type IModalProperties = Omit<MatDialogConfig, 'data'> & { shouldHandleFalse: boolean };

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private _dialog: MatDialog) {}

  open<T = any>(data: IModalData<T>, properties?: IModalProperties): Observable<T> {
    const shouldHandleFalse: boolean = properties?.shouldHandleFalse ?? false;
    delete properties?.shouldHandleFalse;

    return this._dialog
      .open(ModalComponent, {
        ...(properties ?? {}),
        data
      })
      .afterClosed()
      .pipe(filter((res: T): boolean => shouldHandleFalse || Boolean(res)));
  }
}
