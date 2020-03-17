import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '@misc/constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private shouldUseLocalstorage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  set shouldUseLocalstorage(value: boolean) {
    this.shouldUseLocalstorage$.next(value);
  }

  get current(): Storage {
    const alreadyUsedStorage = [sessionStorage, localStorage].find((storage: Storage) =>
      storage.getItem(STORAGE_KEYS.TOKENS)
    );
    const newStorage = this.shouldUseLocalstorage$.value ? localStorage : sessionStorage;

    return alreadyUsedStorage || newStorage;
  }

  get(key: string): string {
    const currentStorage: Storage = [sessionStorage, localStorage].find((storage: Storage): boolean =>
      Boolean(storage.getItem(key))
    );

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
