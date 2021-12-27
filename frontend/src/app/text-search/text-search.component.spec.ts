import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs';
import {instance, mock, when} from 'ts-mockito';
import {LexiconEntryService} from '../services/lexicon-entry.service';

import {TextSearchComponent} from './text-search.component';
import {DeviceService} from '../services/device.service';
import {Router} from '@angular/router';
import {SearchContext} from '../material/searchContext';
import {LocalStorageService} from '../services/local-storage.service';
import {AppSettings} from '../app.settings';
import {SearchMode} from '../values/searchMode';

describe('TextSearchComponent', () => {
  let component: TextSearchComponent;
  let fixture: ComponentFixture<TextSearchComponent>;
  const lexiconEntryServiceMock = mock(LexiconEntryService);
  const deviceService = mock(DeviceService);
  const routerMock = mock(Router);
  const localStorageService = mock(LocalStorageService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: LexiconEntryService, useValue: instance(lexiconEntryServiceMock)},
        {provide: DeviceService, useValue: instance(deviceService)},
        {provide: Router, useValue: instance(routerMock)},
        {provide: LocalStorageService, useValue: instance(localStorageService)},
      ],
      declarations: [ TextSearchComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  when(lexiconEntryServiceMock.getEntryCount()).thenReturn(new Observable<number>());
  when(localStorageService.get(AppSettings.LocalStorageSearchContext)).thenReturn(new SearchContext(SearchMode.Text));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
