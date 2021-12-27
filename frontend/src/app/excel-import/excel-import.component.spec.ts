import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExcelImportComponent} from './excel-import.component';
import {instance, mock} from 'ts-mockito';
import {DomSanitizer} from '@angular/platform-browser';
import {ExcelImportService} from '../services/excel-import.service';

describe('ExcelImportComponent', () => {
  let component: ExcelImportComponent;
  let fixture: ComponentFixture<ExcelImportComponent>;
  const domSanitizerMock = mock(DomSanitizer);
  const excelImportServiceMock = mock(ExcelImportService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExcelImportComponent],
      providers: [
        {provide: DomSanitizer, useValue: instance(domSanitizerMock)},
        {provide: ExcelImportService, useValue: instance(excelImportServiceMock)}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
