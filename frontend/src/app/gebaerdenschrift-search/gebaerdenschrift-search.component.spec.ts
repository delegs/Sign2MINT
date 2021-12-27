import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import {anyString, instance, mock, when} from 'ts-mockito';
import { LexiconEntryService } from '../services/lexicon-entry.service';

import { GebaerdenschriftSearchComponent } from './gebaerdenschrift-search.component';
import {SymbolIdService} from '../services/symbol-id.service';
import {LocalStorageService} from '../services/local-storage.service';
import {SymbolId} from '../values/symbolId';
import { DeviceService } from '../services/device.service';

describe('GebaerdenschriftSearchComponent', () => {
  let component: GebaerdenschriftSearchComponent;
  let fixture: ComponentFixture<GebaerdenschriftSearchComponent>;
  const lexiconEntryServiceMock = mock(LexiconEntryService);
  const symbolIdServiceMock = mock(SymbolIdService);
  const localStorageServiceMock = mock(LocalStorageService);
  const utilServiceMock = mock(DeviceService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: LexiconEntryService, useValue: instance(lexiconEntryServiceMock)},
        {provide: SymbolIdService, useValue: instance(symbolIdServiceMock)},
        {provide: LocalStorageService, useValue: instance(localStorageServiceMock)},
        {provide: DeviceService, useValue: instance(utilServiceMock)},
      ],
      declarations: [ GebaerdenschriftSearchComponent ]
    })
    .compileComponents();
  });

  when(lexiconEntryServiceMock.getEntryCount()).thenReturn(new Observable<number>());
  when(symbolIdServiceMock.getSymbolIdsForSymbolKeys(anyString())).thenReturn(new Observable<SymbolId[]>());

  beforeEach(() => {
    fixture = TestBed.createComponent(GebaerdenschriftSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
