import { Section } from './../../../interfaces/section';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, FormControl } from '@angular/forms';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { CoursesService } from './../../courses.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-section',
  templateUrl: './course-section.component.html',
  styleUrls: ['./course-section.component.sass']
})
export class CourseSectionComponent implements OnInit, OnDestroy {
  @Input() sectionFormGroup: any = UntypedFormGroup;
  @Input() courseFormGroup: any = UntypedFormGroup;
  @Input() sectionIndex:  number;

  formChangesSubscription: any = Subscription;

  private section: any = Section;
  private courseId!:  string;

  constructor(
    private courseService: CoursesService,
    private notificationService: NotificationService,
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.section = new Section().deserialize(this.sectionFormGroup.value);
    this.courseId = this.courseFormGroup.get('id').value;
    this.formChangesSubscription = this.subcribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.formChangesSubscription.unsubscribe();
  }

  subcribeToFormChanges() {
    const formValueChanges$ = this.sectionFormGroup.valueChanges;
    return formValueChanges$.subscribe((formValue: any) => { this.section = new Section().deserialize(formValue); });
  }

  onRemoveSection(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(
        'Confirm deletion',
        'Are you sure you want to delete the section and all the associated lectures?'
      ),
      maxWidth: '400px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.courseService
          .deleteSection(this.section.id, this.courseId)
          .subscribe(res => {
            const control = this.courseFormGroup.get('sections') as UntypedFormArray;
            control.removeAt(index);
            this.notificationService.showSuccess('Lecture successfully deleted');
          });
      }
    });
  }

  onAddLecture() {
    (this.sectionFormGroup.get('lectures') as UntypedFormArray).push(
      this.fb.group({
        id: null,
        title: [null, Validators.required],
        type: ['video', Validators.required],
        videoUrl: null,
        text: null,
        isFree: false
      })
    );
  }

  drop(event: CdkDragDrop<UntypedFormGroup[]>) {
    moveItemInArray(this.sectionFormGroup.get('lectures')['controls'], event.previousIndex, event.currentIndex);
    moveItemInArray(this.sectionFormGroup.controls.lectures.value, event.previousIndex, event.currentIndex);
    this.courseFormGroup.updateValueAndValidity();
  }
}
