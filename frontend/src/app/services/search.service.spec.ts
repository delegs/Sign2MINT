import { TestBed } from '@angular/core/testing';

import { SearchService } from './search.service';
import {anyString, instance, mock, when} from 'ts-mockito';
import {HttpClient} from '@angular/common/http';
import {SymbolIdService} from './symbol-id.service';
import {Observable} from 'rxjs';
import {SymbolId} from '../values/symbolId';

describe('SearchService', () => {
  let service: SearchService;
  const symbolIdServiceMock = mock(SymbolIdService);
  const httpClientMock = mock(HttpClient);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: SymbolIdService, useValue: instance(symbolIdServiceMock)},
        {provide: HttpClient, useValue: instance(httpClientMock)}
      ]
    });
    service = TestBed.inject(SearchService);
  });

  when(symbolIdServiceMock.getSymbolIdsForSymbolKeys(anyString())).thenReturn(new Observable<SymbolId[]>());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
