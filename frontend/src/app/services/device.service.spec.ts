import {TestBed} from '@angular/core/testing';

import {DeviceService} from './device.service';
import {instance, mock} from 'ts-mockito';

describe('DeviceService', () => {
  let service: DeviceService;
  const windowMock = mock(Window);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: Window, useValue: instance(windowMock)}]
    });
    service = TestBed.inject(DeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
