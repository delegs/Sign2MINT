import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperVideoMetadataComponent } from './swiper-video-metadata.component';

describe('SwiperVideoMetadataComponent', () => {
  let component: SwiperVideoMetadataComponent;
  let fixture: ComponentFixture<SwiperVideoMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwiperVideoMetadataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperVideoMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
