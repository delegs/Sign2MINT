import { Injectable } from '@angular/core';
import {RestServiceBase} from './rest-service-base';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService extends RestServiceBase {

  constructor(private httpClient: HttpClient) {
    super();
  }

  sendMail(content: any): Observable<any> {
    const backendUrl = this.getBackendUrl() + '/mail/send';
    return this.httpClient.post(backendUrl, content);
  }
}
