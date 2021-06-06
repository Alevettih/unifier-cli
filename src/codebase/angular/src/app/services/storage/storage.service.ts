import { Injectable } from '@angular/core';
import { StorageKey } from '@models/enums/storage-key.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _shouldUseLocalstorage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  set shouldUseLocalstorage(value: boolean) {
    this._shouldUseLocalstorage$.next(value);
  }

  get current(): Storage {
    const alreadyUsedStorage: Storage = [sessionStorage, localStorage].find((storage: Storage): string =>
      storage.getItem(StorageKey.tokens)
    );
    const newStorage: Storage = this._shouldUseLocalstorage$.value ? localStorage : sessionStorage;

    return alreadyUsedStorage || newStorage;
  }

  get(key: string): string {
    const currentStorage: Storage = [sessionStorage, localStorage].find((storage: Storage): boolean => Boolean(storage.getItem(key)));

    return currentStorage?.getItem(key) || null;
  }

  remove(key: string): void {
    [sessionStorage, localStorage].forEach((storage: Storage): void => {
      storage.removeItem(key);
    });
  }

  clear(): void {
    [sessionStorage, localStorage].forEach((storage: Storage): void => storage.clear());
  }
}
