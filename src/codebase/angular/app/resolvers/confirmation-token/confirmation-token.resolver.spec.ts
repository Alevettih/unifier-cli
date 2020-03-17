import { TestBed } from '@angular/core/testing';

import { ConfirmationTokenResolver } from './confirmation-token.resolver';

describe('ConfirmationTokenResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfirmationTokenResolver = TestBed.inject(ConfirmationTokenResolver);
    expect(service).toBeTruthy();
  });
});
