import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNotificationsListComponent } from './user-notifications-list.component';

describe('UserNotificationsListComponent', () => {
  let component: UserNotificationsListComponent;
  let fixture: ComponentFixture<UserNotificationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserNotificationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotificationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
