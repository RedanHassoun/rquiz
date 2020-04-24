import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersChooserDialogComponent } from './users-chooser-dialog.component';

describe('UsersChooserDialogComponent', () => {
  let component: UsersChooserDialogComponent;
  let fixture: ComponentFixture<UsersChooserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersChooserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersChooserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
