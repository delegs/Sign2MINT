import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EntryNotFoundComponent} from './entry-not-found.component';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {of} from 'rxjs';

describe('EntryNotFoundComponent', () => {
  let component: EntryNotFoundComponent;
  let fixture: ComponentFixture<EntryNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          params: of('fachbegriff'),
          snapshot: {
            paramMap: convertToParamMap({id: 1})
          }
        },
      }],
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
