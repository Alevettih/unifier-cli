import { TestBed, inject } from '@angular/core/testing';

import { ConfirmationEmailGuard } from './confirmation-email.guard';

describe('ConfirmationEmailGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmationEmailGuard]
    });
  });

  it('should ...', inject([ConfirmationEmailGuard], (guard: ConfirmationEmailGuard) => {
    expect(guard).toBeTruthy();
  }));
});
