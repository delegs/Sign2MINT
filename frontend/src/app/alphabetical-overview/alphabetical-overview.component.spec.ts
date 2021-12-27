import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AlphabeticalOverviewComponent} from './alphabetical-overview.component';
import {ActivatedRoute, Router} from '@angular/router';
import {anything, instance, mock, when} from 'ts-mockito';
import {LexiconEntryService} from '../services/lexicon-entry.service';
import {ScrollService} from '../services/scroll.service';
import {DeviceService} from '../services/device.service';
import {of} from 'rxjs';

describe('AlphabeticalOverviewComponent', () => {
  let component: AlphabeticalOverviewComponent;
  let fixture: ComponentFixture<AlphabeticalOverviewComponent>;
  const activatedRouterMock = mock(ActivatedRoute);
  const routerMock = mock(Router);
  const lexiconEntryServiceMock = mock(LexiconEntryService);
  const scrollServiceMock = mock(ScrollService);
  const deviceService = mock(DeviceService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: ActivatedRoute, useValue: instance(activatedRouterMock)},
        {provide: Router, useValue: instance(routerMock)},
        {provide: LexiconEntryService, useValue: instance(lexiconEntryServiceMock)},
        {provide: ScrollService, useValue: instance(scrollServiceMock)},
        {provide: DeviceService, useValue: instance(deviceService)}
      ],
      declarations: [AlphabeticalOverviewComponent]
    })
      .compileComponents();
  });

  when(lexiconEntryServiceMock.getEntryCount(anything())).thenReturn(of(42));
  when(lexiconEntryServiceMock.getAllEntriesForCharacter(anything(), anything())).thenReturn(of([]));
  when(activatedRouterMock.params).thenReturn(of({}));
  when(scrollServiceMock.getPreviousScrollPosition()).thenReturn({windowPositionY: 0, containerPositionY: 0});

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphabeticalOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
