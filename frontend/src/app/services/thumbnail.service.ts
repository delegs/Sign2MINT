import { Injectable } from '@angular/core';
import {RestServiceBase} from './rest-service-base';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailService extends RestServiceBase {

  getThumbnailLink(lexikonEntryId: string): string {

    return lexikonEntryId ? `${this.getBackendUrl()}/thumbnail/${lexikonEntryId}` : '';
  }
}
