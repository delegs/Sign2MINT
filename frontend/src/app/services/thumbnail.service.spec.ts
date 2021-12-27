import { TestBed } from '@angular/core/testing';

import { ThumbnailService } from './thumbnail.service';

describe('ThumbnailService', () => {
  let service: ThumbnailService;

  beforeEach(() => {
    service = TestBed.inject(ThumbnailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
