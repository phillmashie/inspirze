import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropVideoUploadComponent } from './drag-drop-video-upload.component';

describe('DragDropVideoUploadComponent', () => {
  let component: DragDropVideoUploadComponent;
  let fixture: ComponentFixture<DragDropVideoUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragDropVideoUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragDropVideoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
