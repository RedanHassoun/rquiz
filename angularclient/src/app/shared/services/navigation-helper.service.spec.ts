import { TestBed } from '@angular/core/testing';

import { NavigationHelperService } from './navigation-helper.service';

describe('NavigationHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigationHelperService = TestBed.get(NavigationHelperService);
    expect(service).toBeTruthy();
  });
});
