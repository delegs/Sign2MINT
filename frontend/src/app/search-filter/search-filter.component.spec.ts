import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchFilterComponent} from './search-filter.component';
import {anyOfClass, instance, mock, when} from 'ts-mockito';
import {SearchService} from '../services/search.service';
import {Observable} from 'rxjs';
import {LexiconEntry} from '../material/lexiconEntry';
import {LocalStorageService} from '../services/local-storage.service';

describe('SearchFilterComponent', () => {
  let component: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;
  const localStorageServiceMock = mock(LocalStorageService);
  const searchServiceMock = mock(SearchService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: LocalStorageService, useValue: instance(localStorageServiceMock)},
        {provide: SearchService, useValue: instance(searchServiceMock)},
      ],
      declarations: [ SearchFilterComponent ]
    })
    .compileComponents();
  });

  when(searchServiceMock.search(anyOfClass(Object))).thenReturn(new Observable<LexiconEntry[]>());

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
