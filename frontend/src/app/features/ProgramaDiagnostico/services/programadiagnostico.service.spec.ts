import { TestBed } from '@angular/core/testing';

import { ProgramadiagnosticoService } from './programadiagnostico.service';

describe('ProgramadiagnosticoService', () => {
  let service: ProgramadiagnosticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramadiagnosticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
