import { Section } from './../../../interfaces/section';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
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
  @Input() sectionFormGroup: FormGroup;
  @Input() courseFormGroup: FormGroup;
  @Input() sectionIndex: number;

  formChangesSubscription: Subscription;

  private section: Section;
  private courseId: string;

  constructor(
    private courseService: CoursesService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
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
    return formValueChanges$.subscribe(formValue => { this.section = new Section().deserialize(formValue); });
  }

  onRemoveSection(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(
        'Confirm deletion',
        'Are you sure you want to delete the Module and all the associated lectures and Quiz?'
      ),
      maxWidth: '400px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.courseService
          .deleteSection(this.section.id, this.courseId)
          .subscribe(res => {
            const control = this.courseFormGroup.get('sections') as FormArray;
            control.removeAt(index);
            this.notificationService.showSuccess('Lecture successfully deleted');
          });
      }
    });
  }

  onAddLecture() {
    (this.sectionFormGroup.get('lectures') as FormArray).push(
      this.fb.group({
        id: null,
        title: [null, Validators.required],
        text: null,
      })
    );
  }

  onAddQuestion() {
    (this.sectionFormGroup.get('questions') as FormArray).push(
      this.fb.group({
        id: null,
        title: [null, Validators.required],
        question: null,
        options: null,
        answer: null,
      })
    );
  }


  drop(event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(this.sectionFormGroup.get('lectures')['controls'], event.previousIndex, event.currentIndex);
    moveItemInArray(this.sectionFormGroup.controls['lectures'].value, event.previousIndex, event.currentIndex);
    moveItemInArray(this.sectionFormGroup.get('questions')['controls'], event.previousIndex, event.currentIndex);
    moveItemInArray(this.sectionFormGroup.controls['questions'].value, event.previousIndex, event.currentIndex);
    this.courseFormGroup.updateValueAndValidity();
  }

}
