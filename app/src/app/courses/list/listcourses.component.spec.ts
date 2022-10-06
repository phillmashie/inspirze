import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCoursesComponent } from './listcourses.component';

describe('ListComponent', () => {
  let component: ListCoursesComponent;
  let fixture: ComponentFixture<ListCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
