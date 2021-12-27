import { TestBed } from '@angular/core/testing';

import { ExcelImportService } from './excel-import.service';
import {instance, mock} from "ts-mockito";
import {HttpClient} from "@angular/common/http";

describe('ExcelImportService', () => {
  let service: ExcelImportService;
  const httpClientMock = mock(HttpClient);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: instance(httpClientMock)}
      ]
    });
    service = TestBed.inject(ExcelImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
