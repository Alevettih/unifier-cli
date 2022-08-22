import { TestBed } from '@angular/core/testing';

import { ToolbarHelperService } from './toolbar-helper.service';

describe('ToolbarHelperService', () => {
  let service: ToolbarHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolbarHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
