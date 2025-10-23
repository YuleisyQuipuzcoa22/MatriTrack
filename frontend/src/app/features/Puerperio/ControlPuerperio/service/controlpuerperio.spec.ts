import { TestBed } from '@angular/core/testing';

import { Controlpuerperio } from './controlpuerperio';

describe('Controlpuerperio', () => {
  let service: Controlpuerperio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Controlpuerperio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
