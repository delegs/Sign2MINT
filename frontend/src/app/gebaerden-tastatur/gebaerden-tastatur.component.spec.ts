import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GebaerdenTastaturComponent } from './gebaerden-tastatur.component';

describe('GebaerdenTastaturComponent', () => {
  let component: GebaerdenTastaturComponent;
  let fixture: ComponentFixture<GebaerdenTastaturComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GebaerdenTastaturComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GebaerdenTastaturComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
