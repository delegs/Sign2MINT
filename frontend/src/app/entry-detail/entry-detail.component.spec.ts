import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EntryDetailComponent} from './entry-detail.component';
import {LexiconEntryService} from '../services/lexicon-entry.service';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {Location} from '@angular/common';
import {ScrollService} from '../services/scroll.service';
import {instance, mock, when} from 'ts-mockito';
import {of} from 'rxjs';
import {DeviceService} from '../services/device.service';
import {DomSanitizer, Meta} from '@angular/platform-browser';
import {ThumbnailService} from '../services/thumbnail.service';
import {LocalStorageService} from '../services/local-storage.service';

describe('EntryDetailComponent', () => {
  let component: EntryDetailComponent;
  let fixture: ComponentFixture<EntryDetailComponent>;
  const lexiconEntryServiceMock = mock(LexiconEntryService);
  const activatedRouteMock = mock(ActivatedRoute);
  const routerMock = mock(Router);
  const locationMock = mock(Location);
  const scrollServiceMock = mock(ScrollService);
  const utilServiceMock = mock(DeviceService);
  const metaServiceMock = mock(Meta);
  const domSanitizerMock = mock(DomSanitizer);
  const thumbnailServiceMock = mock(ThumbnailService);
  const localStorageServiceMock = mock(LocalStorageService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: LexiconEntryService, useValue: instance(lexiconEntryServiceMock)
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of('fachbegriff'),
            snapshot: {
              routeConfig: {path: 'path'},
              paramMap: convertToParamMap({id: 1})
            }
          },
        },

        {provide: Router, useValue: instance(routerMock)},
        {provide: Location, useValue: instance(locationMock)},
        {provide: ScrollService, useValue: instance(scrollServiceMock)},
        {provide: DeviceService, useValue: instance(utilServiceMock)},
        {provide: Meta, useValue: instance(metaServiceMock)},
        {provide: DomSanitizer, useValue: instance(domSanitizerMock)},
        {provide: ThumbnailService, useValue: instance(thumbnailServiceMock)},
        {provide: LocalStorageService, useValue: instance(localStorageServiceMock)},
      ],
      declarations: [EntryDetailComponent]
    })
      .compileComponents();
  });

  when(activatedRouteMock.params).thenReturn(of({}));
  when(utilServiceMock.isMobile()).thenReturn(true);

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
