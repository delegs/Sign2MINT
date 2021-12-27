import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { VideoShareComponent } from './video-share.component';

describe('VideoShareComponent', () => {
  let component: VideoShareComponent;
  let fixture: ComponentFixture<VideoShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: ActivatedRoute,
          useValue: {
            params: of('fachbegriff'),
            snapshot: {
              paramMap: convertToParamMap({id: 1})
            }
         },
       },
      ],
      declarations: [ VideoShareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
