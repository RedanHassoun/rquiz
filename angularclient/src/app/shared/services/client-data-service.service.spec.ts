import { TestBed } from '@angular/core/testing';

import { ClientDataServiceService } from './client-data-service.service';

describe('ClientDataServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientDataServiceService = TestBed.get(ClientDataServiceService);
    expect(service).toBeTruthy();
  });
});
