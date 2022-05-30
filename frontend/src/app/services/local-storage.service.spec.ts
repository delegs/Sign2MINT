import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageServiceService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('with two entries stored', () => {

    const KEY_1 = 'key1';
    const KEY_2 = 'key2';
    const VALUE_1 = 'value1';
    const VALUE_2 = 'value2';

    beforeEach(() => {
      service.set(KEY_1, VALUE_1);
      service.set(KEY_2, VALUE_2);
    });

    it('should return return correct value by key', () => {
      expect(service.get(KEY_1)).toEqual(VALUE_1);
      expect(service.get(KEY_2)).toEqual(VALUE_2);
    });

    describe('when removing one key', () => {
      beforeEach(() => {
        service.remove(KEY_1);
      });

      it('should remove the entry', () => {
        expect(service.get(KEY_1)).toBeNull();
      });

      it('should keep other entries', () => {
        expect(service.get(KEY_2)).toEqual(VALUE_2);
      });
    });
  });
});
