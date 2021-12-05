import { TestBed } from '@angular/core/testing';

import { NeptexShopFormService } from './neptex-shop-form.service';

describe('NeptexShopFormService', () => {
  let service: NeptexShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeptexShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
