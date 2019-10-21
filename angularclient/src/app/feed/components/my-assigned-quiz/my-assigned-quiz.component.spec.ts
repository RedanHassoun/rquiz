import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAssignedQuizComponent } from './my-assigned-quiz.component';

describe('MyAssignedQuizComponent', () => {
  let component: MyAssignedQuizComponent;
  let fixture: ComponentFixture<MyAssignedQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAssignedQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAssignedQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
