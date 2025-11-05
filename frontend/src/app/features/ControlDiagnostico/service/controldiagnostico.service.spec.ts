import { TestBed } from '@angular/core/testing';

import { ControldiagnosticoService } from './controldiagnostico.service';

describe('ControldiagnosticoService', () => {
  let service: ControldiagnosticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControldiagnosticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
