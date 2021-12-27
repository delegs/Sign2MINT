import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LexiconEntry } from '../material/lexiconEntry';

import { SearchResultEntryComponent } from './search-result-entry.component';

describe('SearchResultEntryComponent', () => {
  let component: SearchResultEntryComponent;
  let fixture: ComponentFixture<SearchResultEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchResultEntryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultEntryComponent);
    component = fixture.componentInstance;
    component.lexikonEintrag = new LexiconEntry();
    component.lexikonEintrag.gebaerdenschrift = {
      url: '',
      symbolIds: []
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
