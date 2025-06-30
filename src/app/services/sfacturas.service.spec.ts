import { TestBed } from '@angular/core/testing';

import { SFacturasService } from '../services/sfacturas.service';

describe('SFacturasService', () => {
  let service: SFacturasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SFacturasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
