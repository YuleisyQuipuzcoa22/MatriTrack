import { TestBed } from '@angular/core/testing';

import { DetalleAnalisisService } from './detalle-analisis.service';

describe('DetalleAnalisisService', () => {
  let service: DetalleAnalisisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleAnalisisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
