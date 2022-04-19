import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSpacerComponent } from './icon-spacer.component';

describe('IconSpacerComponent', () => {
  let component: IconSpacerComponent;
  let fixture: ComponentFixture<IconSpacerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconSpacerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconSpacerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
