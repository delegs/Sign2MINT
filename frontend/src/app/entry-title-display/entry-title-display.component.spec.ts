import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryTitleDisplayComponent } from './entry-title-display.component';

describe('EntryTitleDisplayComponent', () => {
  let component: EntryTitleDisplayComponent;
  let fixture: ComponentFixture<EntryTitleDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryTitleDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryTitleDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
