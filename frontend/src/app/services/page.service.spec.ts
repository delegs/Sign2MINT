import {TestBed} from '@angular/core/testing';

import {PageService} from './page.service';
import {HttpClient} from '@angular/common/http';
import {instance, mock} from 'ts-mockito';

describe('PageService', () => {
  let service: PageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: HttpClient, useValue: instance(mock(HttpClient))
      }]
    });
    service = TestBed.inject(PageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
