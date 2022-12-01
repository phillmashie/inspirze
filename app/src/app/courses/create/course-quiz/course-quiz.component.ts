import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { CoursesService } from './../../courses.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subscription } from 'rxjs';
import { Quiz } from 'src/app/interfaces/quiz';

@Component({
  selector: 'app-course-quiz',
  templateUrl: './course-quiz.component.html',
  styleUrls: ['./course-quiz.component.css']
})
export class CourseQuizComponent implements OnInit {

  @Input() quizFormGroup: FormGroup;
  @Input() courseFormGroup: FormGroup;
  @Input() quizIndex: number;

  formChangesSubscription: Subscription;

  private quiz: Quiz;
  private courseId: string;
  form: any;

  constructor(
    private courseService: CoursesService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.quiz = new Quiz().deserialize(this.quizFormGroup.value);
    this.courseId = this.courseFormGroup.get('id').value;
    this.formChangesSubscription = this.subcribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.formChangesSubscription.unsubscribe();
  }

  subcribeToFormChanges() {
    const formValueChanges$ = this.quizFormGroup.valueChanges;
    return formValueChanges$.subscribe(formValue => { this.quiz = new Quiz().deserialize(formValue); });
  }

  onRemoveQuiz(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(
        'Confirm deletion',
        'Are you sure you want to delete the Quiz?'
      ),
      maxWidth: '400px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.courseService
          .deleteSection(this.quiz.id, this.courseId)
          .subscribe(res => {
            const control = this.courseFormGroup.get('quizs') as FormArray;
            control.removeAt(index);
            this.notificationService.showSuccess('Questions successfully deleted');
          });
      }
    });
  }

  onAddQuestion() {
    (this.quizFormGroup.get('questions') as FormArray).push(
      this.fb.group({
        id: null,
        title: [null, Validators.required],
        question: null,
        options: this.fb.array([]),
        answer: null,
      })
    );
  }



  drop(event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(this.quizFormGroup.get('questions')['controls'], event.previousIndex, event.currentIndex);
    moveItemInArray(this.quizFormGroup.controls['questions'].value, event.previousIndex, event.currentIndex);
    this.courseFormGroup.updateValueAndValidity();
  }

}
