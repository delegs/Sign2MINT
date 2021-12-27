import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LexiconEntry} from '../material/lexiconEntry';
import {RestServiceBase} from './rest-service-base';

@Injectable({
  providedIn: 'root'
})
export class LexiconEntryService extends RestServiceBase {

  constructor(private httpClient: HttpClient) {
    super();
  }

  getEntryCount(fachgebiete?: string): Observable<number> {
    let params: any;
    if (fachgebiete && fachgebiete.length) {
      params = new HttpParams().set('fachgebiete', fachgebiete);
    }
    return this.httpClient.get<number>(`${this.getBackendUrl()}/entries/count`, {params});
  }

  getEntryByFachbegriff(fachbegriff: string): Observable<LexiconEntry[]> {
    return this.httpClient.get<LexiconEntry[]>(`${this.getBackendUrl()}/entries/fachbegriff/${fachbegriff}`);
  }

  getAllEntriesForCharacter(character: string, fachgebiete?: string): Observable<LexiconEntry[]> {
    let params: any;
    if (fachgebiete && fachgebiete.length) {
      params = new HttpParams().set('fachgebiete', fachgebiete);
    }
    return this.httpClient.get<LexiconEntry[]>(`${this.getBackendUrl()}/entries/all/${character}`, {params});
  }

  getEntriesBySearchTerm(searchTerm: string): Observable<LexiconEntry[]>{
    return this.httpClient.get<LexiconEntry[]>(`${this.getBackendUrl()}/entries/search/${searchTerm}`);
  }

  getEntriesForAllSymbolIds(symbolIds): Observable<LexiconEntry[]> {
    const backendUrl = `${this.getBackendUrl()}/entries/symbolIds`;
    return this.httpClient.post<LexiconEntry[]>(backendUrl, symbolIds, this.httpOptions);
  }
}
