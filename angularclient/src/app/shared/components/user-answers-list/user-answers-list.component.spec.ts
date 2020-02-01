import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAnswersListComponent } from './user-answers-list.component';

describe('UserAnswersListComponent', () => {
  let component: UserAnswersListComponent;
  let fixture: ComponentFixture<UserAnswersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAnswersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAnswersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
