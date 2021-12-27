import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { instance, mock, when } from 'ts-mockito';
import { DeviceService } from '../services/device.service';

import { SearchMenuComponent } from './search-menu.component';

describe('SearchMenuComponent', () => {
  let component: SearchMenuComponent;
  let fixture: ComponentFixture<SearchMenuComponent>;
  const utilServiceMock = mock(DeviceService);
  const routerMock = mock(Router);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: DeviceService, useValue: instance(utilServiceMock)},
        {provide: Router, useValue: instance(routerMock)},
      ],
      declarations: [ SearchMenuComponent ]
    })
    .compileComponents();
  });

  when(utilServiceMock.isSmallMobile()).thenReturn(true);

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
