import { Injectable } from '@angular/core';
import { StorageKey } from '@models/enums/storage-key.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly _SHOULD_USE_LOCALSTORAGE$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  set shouldUseLocalstorage(shouldUseLocalstorage: boolean) {
    this._SHOULD_USE_LOCALSTORAGE$.next(shouldUseLocalstorage);
  }

  get current(): Storage {
    const alreadyUsedStorage: Storage = [sessionStorage, localStorage].find((storage: Storage): string =>
      storage.getItem(StorageKey.tokens)
    );
    const newStorage: Storage = this._SHOULD_USE_LOCALSTORAGE$.value ? localStorage : sessionStorage;

    return alreadyUsedStorage || newStorage;
  }

  get<T>(key: string): T {
    const currentStorage: Storage = [sessionStorage, localStorage].find((storage: Storage): boolean => Boolean(storage.getItem(key)));

    return currentStorage?.getItem(key) ? JSON.parse(currentStorage?.getItem(key)) : null;
  }

  set(name: StorageKey, value: unknown): void {
    this.current.setItem(name, JSON.stringify(value ?? ''));
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
