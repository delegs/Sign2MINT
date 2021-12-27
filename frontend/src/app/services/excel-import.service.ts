import {Injectable} from '@angular/core';
import {RestServiceBase} from './rest-service-base';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelImportService extends RestServiceBase {

  constructor(private httpClient: HttpClient) {
    super();
  }

  import(filesToImport: any[]): Observable<string> {
    const excelImportUrl = environment.excelImportUrl;
    const formData = new FormData();
    filesToImport = filesToImport.sort((fileToImport) => fileToImport.name.endsWith('.zip') ? -1 : 0);
    filesToImport.forEach(fileToImport => formData.append(fileToImport.name, fileToImport));

    return this.httpClient.post<string>(excelImportUrl, formData);
  }
}
