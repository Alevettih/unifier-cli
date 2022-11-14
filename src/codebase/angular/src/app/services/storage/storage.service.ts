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

  private get _current(): Storage {
    const alreadyUsedStorage: Storage = [sessionStorage, localStorage].find((storage: Storage): string =>
      storage.getItem(StorageKey.tokens)
    );
    const newStorage: Storage = this._shouldUseLocalstorage$.value ? localStorage : sessionStorage;

    return alreadyUsedStorage || newStorage;
  }

  get<T>(key: string): T {
    const currentStorage: Storage = [sessionStorage, localStorage].find((storage: Storage): boolean => Boolean(storage.getItem(key)));

    try {
      return currentStorage?.getItem(key) ? JSON.parse(atob(currentStorage?.getItem(key).split('').reverse().join(''))) : null;
    } catch (err) {
      console.warn(`Can't decode value: `, err);
      return null;
    }
  }

  set(name: StorageKey, value: any): void {
    this._current.setItem(
      name,
      btoa(JSON.stringify(value ?? ''))
        .replace(/=/gi, '')
        .split('')
        .reverse()
        .join('')
    );
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
