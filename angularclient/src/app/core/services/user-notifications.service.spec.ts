import { TestBed } from '@angular/core/testing';

import { UserNotificationsService } from './user-notifications.service';

describe('NotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserNotificationsService = TestBed.get(UserNotificationsService);
    expect(service).toBeTruthy();
  });
});
