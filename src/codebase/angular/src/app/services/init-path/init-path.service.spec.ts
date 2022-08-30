import { TestBed } from '@angular/core/testing';

import { InitPathService } from './init-path.service';

describe('InitPathService', () => {
  let service: InitPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitPathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
