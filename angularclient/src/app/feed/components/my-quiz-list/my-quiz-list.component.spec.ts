import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuizListComponent } from './my-quiz-list.component';

describe('MyQuizListComponent', () => {
  let component: MyQuizListComponent;
  let fixture: ComponentFixture<MyQuizListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyQuizListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyQuizListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
