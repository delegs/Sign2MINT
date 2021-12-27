import {environment} from '../../environments/environment';
import {HttpHeaders} from '@angular/common/http';

export abstract class RestServiceBase {

  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  protected getBackendUrl(): string {
    const getUrl = window.location;
    const baseName = getUrl.host.split('.');
    const ending = baseName[baseName.length - 1];

    if ('org' === ending) {
      return environment.backendOrgUrl;
    }

    if ('com' === ending) {
      return environment.backendComUrl;
    }
    return environment.backendDeUrl;
  }
}
