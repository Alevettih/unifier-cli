import { TestBed } from '@angular/core/testing';

import { MeResolver } from './me.resolver';

describe('Role.ResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeResolver = TestBed.inject(MeResolver);
    expect(service).toBeTruthy();
  });
});
