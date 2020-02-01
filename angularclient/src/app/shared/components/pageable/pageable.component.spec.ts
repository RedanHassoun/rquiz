import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageableComponent } from './pageable.component';

describe('PageableComponent', () => {
  let component: PageableComponent;
  let fixture: ComponentFixture<PageableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
