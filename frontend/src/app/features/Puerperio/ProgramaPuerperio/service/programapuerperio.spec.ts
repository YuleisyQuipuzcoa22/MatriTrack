import { TestBed } from '@angular/core/testing';

import { Programapuerperio } from './programapuerperio';

describe('Programapuerperio', () => {
  let service: Programapuerperio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Programapuerperio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
