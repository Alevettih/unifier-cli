import { TestBed } from '@angular/core/testing';

import { JwtInterceptor } from './jwt.interceptor';

describe('Jwt.InterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JwtInterceptor = TestBed.inject(JwtInterceptor);
    expect(service).toBeTruthy();
  });
});
