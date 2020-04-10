import { TestBed } from '@angular/core/testing';

import { ScssStyleService } from './scss-style.service';

describe('ScssStyleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScssStyleService = TestBed.get(ScssStyleService);
    expect(service).toBeTruthy();
  });
});
