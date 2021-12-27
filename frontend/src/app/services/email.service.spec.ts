import { TestBed } from '@angular/core/testing';

import { EmailService } from './email.service';
import {instance, mock} from 'ts-mockito';
import {HttpClient} from '@angular/common/http';

describe('EmailService', () => {
  let service: EmailService;
  const httpClientMock = mock(HttpClient);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: instance(httpClientMock)}
      ]
    });
    service = TestBed.inject(EmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
