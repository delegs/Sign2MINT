import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EntryNotFoundComponent} from './entry-not-found.component';
import {ActivatedRoute, Router, convertToParamMap} from '@angular/router';
import {LocalStorageService} from '../services/local-storage.service';
import {of} from 'rxjs';
import {mock} from 'ts-mockito';

describe('EntryNotFoundComponent', () => {
  let component: EntryNotFoundComponent;
  let fixture: ComponentFixture<EntryNotFoundComponent>;
  const routerMock = mock(Router);
  const localStorageMock = mock(LocalStorageService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of('fachbegriff'),
            snapshot: {
              paramMap: convertToParamMap({id: 1})
            }
          },
        },
        {provide: Router, useValue: routerMock},
        {provide: LocalStorageService, useValue: localStorageMock}],
      declarations: [EntryNotFoundComponent]
    })
      .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(EntryNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
