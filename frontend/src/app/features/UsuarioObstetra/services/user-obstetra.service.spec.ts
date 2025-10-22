import { TestBed } from '@angular/core/testing';

import { UserObstetraService } from './user-obstetra.service';

describe('UserObstetraService', () => {
  let service: UserObstetraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserObstetraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
