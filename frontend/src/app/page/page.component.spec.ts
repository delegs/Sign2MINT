import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PageComponent} from './page.component';
import {anything, instance, mock, when} from 'ts-mockito';
import {PageService} from '../services/page.service';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {of} from 'rxjs';

describe('PageComponent', () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;
  const pageServiceMock = mock(PageService);
  const activatedRouteMock = mock(ActivatedRoute);
  const routerMock = mock(Router);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: ActivatedRoute, useValue: instance(activatedRouteMock)},
        {provide: PageService, useValue: instance(pageServiceMock)},
        {provide: Router, useValue: instance(routerMock)}
      ],
      declarations: [PageComponent]
    })
      .compileComponents();
  });
  when(activatedRouteMock.paramMap).thenReturn(of(convertToParamMap({fachgebiet: 'aaa'})));
  when(pageServiceMock.getPage(anything())).thenReturn(of());
  when(routerMock.events).thenReturn(of());

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
