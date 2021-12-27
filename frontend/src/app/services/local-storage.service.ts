import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LocalStorageOperation} from '../values/localStorageOperation';
import {LocalStorageEventArgs} from '../material/localStorageEventArgs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  localStorage: Storage;
  localStorageChangedEvent = new Subject();

  constructor() {
    this.localStorage = window.localStorage;
  }

  get(key: string): any {
    try {
      return this.isLocalStorageSupported ? JSON.parse(this.localStorage.getItem(key)) : null;
    } catch (exception) {
      return null;
    }
  }

  set(key: string, value: any): boolean {
    try {
      if (this.isLocalStorageSupported) {
        this.localStorage.setItem(key, JSON.stringify(value));
        const eventArgs = LocalStorageEventArgs.create(LocalStorageOperation.Set, key, value);
        this.localStorageChangedEvent.next(eventArgs);
      }
    } catch (exception) {
      return false;
    }
    return true;
  }

  remove(key: string): boolean {
    try {
      if (this.isLocalStorageSupported) {
        this.localStorage.removeItem(key);
        const eventArgs = LocalStorageEventArgs.create(LocalStorageOperation.Set, key, undefined);
        this.localStorageChangedEvent.next(eventArgs);
      }
    } catch (exception) {
      return false;
    }
    return true;
  }

  get isLocalStorageSupported(): boolean {
    return !!this.localStorage;
  }
}
