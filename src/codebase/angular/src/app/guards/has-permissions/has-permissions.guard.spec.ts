import { TestBed } from '@angular/core/testing';

import { HasPermissionsGuard } from './has-permissions.guard';

describe('HasPermissionsGuard', () => {
  let guard: HasPermissionsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HasPermissionsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
