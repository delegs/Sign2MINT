import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {RestServiceBase} from './rest-service-base';

@Injectable({
  providedIn: 'root'
})
export class PageService extends RestServiceBase{

  constructor(private httpClient: HttpClient) {
    super();
  }

  getPage(pageName: string): Observable<any> {
    return this.httpClient.get<any>(`${this.getBackendUrl()}/page/${pageName}`);
  }
}
