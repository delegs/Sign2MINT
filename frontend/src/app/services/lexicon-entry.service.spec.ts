import {TestBed} from '@angular/core/testing';

import {LexiconEntryService} from './lexicon-entry.service';
import {HttpClient} from '@angular/common/http';
import {instance, mock} from 'ts-mockito';

describe('LexiconEntryService', () => {
  let service: LexiconEntryService;
  const httpClientMock = mock(HttpClient);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: instance(httpClientMock)}
      ]
    });
    service = TestBed.inject(LexiconEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
