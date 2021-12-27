import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryDefinitionComponent } from './entry-definition.component';

describe('EntryDefinitionComponent', () => {
  let component: EntryDefinitionComponent;
  let fixture: ComponentFixture<EntryDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryDefinitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
