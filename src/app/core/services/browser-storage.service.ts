import { Injectable } from '@angular/core';
import { BrowserStorageKey } from '../enums/browser-storage-key.enum';

@Injectable({ providedIn: 'root' })
export class BrowserStorageService {
  set(key: BrowserStorageKey, value: string): void {
    localStorage.setItem(key, value);
  }

  get(key: BrowserStorageKey): string {
    return localStorage.getItem(key) as string;
  }

  setObject<T>(key: BrowserStorageKey, obj: T): string {
    const value = JSON.stringify(obj);
    this.set(key, value);

    return value;
  }

  getParse<T>(key: BrowserStorageKey): T {
    const value = this.get(key);
    const valueParse = JSON.parse(value) as T;

    return valueParse;
  }

  remove(key: BrowserStorageKey): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
