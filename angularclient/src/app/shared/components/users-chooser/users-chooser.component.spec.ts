import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersChooserComponent } from './users-chooser.component';

describe('UsersChooserComponent', () => {
  let component: UsersChooserComponent;
  let fixture: ComponentFixture<UsersChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
