import { TestBed } from '@angular/core/testing';

import { ResultadoAnalisisService } from './resultado-analisis'; 

describe('ResultadoAnalisisService', () => { 
  let service: ResultadoAnalisisService; 

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultadoAnalisisService); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});