import { TestBed } from '@angular/core/testing';

import { SymbolIdService } from './symbol-id.service';
import {instance, mock} from 'ts-mockito';
import {HttpClient} from '@angular/common/http';

describe('SymbolIdService', () => {
  let service: SymbolIdService;
  const httpClientMock = mock(HttpClient);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: instance(httpClientMock)}
      ]
    });
    service = TestBed.inject(SymbolIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
