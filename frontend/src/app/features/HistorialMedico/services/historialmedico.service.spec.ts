import { TestBed } from '@angular/core/testing';

import { HistorialmedicoService } from './historialmedico.service';

describe('HistorialmedicoService', () => {
  let service: HistorialmedicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialmedicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
