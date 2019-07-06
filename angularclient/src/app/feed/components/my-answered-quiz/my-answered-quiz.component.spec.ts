import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAnsweredQuizComponent } from './my-answered-quiz.component';

describe('MyAnsweredQuizComponent', () => {
  let component: MyAnsweredQuizComponent;
  let fixture: ComponentFixture<MyAnsweredQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAnsweredQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAnsweredQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
