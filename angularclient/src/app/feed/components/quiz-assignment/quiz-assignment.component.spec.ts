import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAssignmentComponent } from './quiz-assignment.component';

describe('QuizAssignmentComponent', () => {
  let component: QuizAssignmentComponent;
  let fixture: ComponentFixture<QuizAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
