import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LocalStorageOperation} from '../values/localStorageOperation';
import {LocalStorageEventArgs} from '../material/localStorageEventArgs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  storage: any = {};
  localStorageChangedEvent = new Subject();

  get(key: string): any {
    return this.storage[key] ?? null;
  }

  set(key: string, value: any): void {
    this.storage[key] = value;
    const event: LocalStorageEventArgs = {
      operation: LocalStorageOperation.Set,
      key,
      value,
    };
    this.localStorageChangedEvent.next(event);
  }

  remove(key: string): void {
    delete this.storage[key];
    const event: LocalStorageEventArgs = {
      operation: LocalStorageOperation.Remove,
      key,
      value: null,
    };
    this.localStorageChangedEvent.next(event);
  }
}
