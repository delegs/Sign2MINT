import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SymbolId} from '../values/symbolId';
import {RestServiceBase} from './rest-service-base';

@Injectable({
  providedIn: 'root'
})
export class SymbolIdService extends RestServiceBase{

  constructor(private httpClient: HttpClient) {
    super();
  }

  getSymbolIdsForSymbolKeys(symbolKeysAsJson: string): Observable<SymbolId[]> {
    const backendUrl = `${this.getBackendUrl()}/symbolIds/byKeys`;
    return this.httpClient.post<SymbolId[]>(backendUrl, symbolKeysAsJson, this.httpOptions);
  }
}
