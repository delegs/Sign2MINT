import {LocalStorageOperation} from '../values/localStorageOperation';
export class LocalStorageEventArgs {

  operation: LocalStorageOperation;
  key: string;
  value: any;

  public static create(operation: LocalStorageOperation, key: string, value: string): LocalStorageEventArgs {
    const eventArgs = new LocalStorageEventArgs();
    eventArgs.operation = operation;
    eventArgs.key = key;
    eventArgs.value = value;
    return eventArgs;
  }



}
