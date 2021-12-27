import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {Router} from '@angular/router';
import {instance, mock} from 'ts-mockito';
import {ScrollService} from '../services/scroll.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const routerMock = mock(Router);
  const scrollServiceMock = mock(ScrollService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: instance(routerMock)},
        {provide: ScrollService, useValue: instance(scrollServiceMock)}
      ],
      declarations: [HeaderComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
