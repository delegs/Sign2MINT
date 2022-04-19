import {ComponentFixture, TestBed} from '@angular/core/testing';
import {anything, instance, mock, resetCalls, verify, when} from 'ts-mockito';
import {LandingpageComponent} from './landingpage.component';
import {Router} from '@angular/router';
import {LexiconEntryService} from '../services/lexicon-entry.service';
import {of} from 'rxjs';
import {DeviceService} from '../services/device.service';

describe('LandingpageComponent', () => {
  let component: LandingpageComponent;
  let fixture: ComponentFixture<LandingpageComponent>;
  const routerMock = mock(Router);
  const lexiconEntryServiceMock = mock(LexiconEntryService);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingpageComponent],
      providers: [
        {provide: Router, useValue: instance(routerMock)},
        {provide: LexiconEntryService, useValue: instance(lexiconEntryServiceMock)},
      ]
    })
      .compileComponents();
  });

  const totalCount = 1337;

  beforeEach(() => {
    // Arrange
    when(lexiconEntryServiceMock.getEntryCount()).thenReturn(of(totalCount));
    when(lexiconEntryServiceMock.getEntryCount(anything())).thenReturn(of(42));

    // Act
    resetCalls(lexiconEntryServiceMock);
    fixture = TestBed.createComponent(LandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Asserts

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load total entry counts', () => {
    verify(lexiconEntryServiceMock.getEntryCount()).once();
  });

  it('should save total entry count from backend correctly', () => {
    expect(component.entryCount).toBe(totalCount);
  });

  it('should load fachbegebiete counts', () => {
    component.fachgebiete.forEach(fachgebiet => verify(lexiconEntryServiceMock.getEntryCount(fachgebiet.title)).once());
  });
});
