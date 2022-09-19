import { Question } from './../../../../interfaces/question';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, ValidationErrors, FormArray, FormGroup } from '@angular/forms';

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CoursesService } from 'src/app/courses/courses.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.sass']
})
export class QuizComponent implements OnInit {

  @Input() questionFormGroup: FormGroup;
  @Input() sectionFormGroup: FormGroup;
  @Input() courseFormGroup: FormGroup;
  @Input() questionIndex: number;

  formChangesSubscription: Subscription;

  progress = 0;
  successMsg = '';
  question: Question;
  sectionId: string;
  courseId: string;

  answer = new Array(10).fill("0");
  correctAnswer = new Array(10).fill(0);
i: any;

  constructor(
    private courseService: CoursesService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.question = new Question().deserialize(this.questionFormGroup.value);
    this.sectionId = this.sectionFormGroup.get('id').value;
    this.courseId = this.courseFormGroup.get('id').value;
    this.formChangesSubscription = this.subcribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.formChangesSubscription.unsubscribe();
  }

  subcribeToFormChanges() {
    const formValueChanges$ = this.questionFormGroup.valueChanges;
    return formValueChanges$.subscribe(formValue => { this.question = new Question().deserialize(formValue); this.getFormValidationErrors()});
  }

  getFormValidationErrors() {
    // tslint:disable-next-line: forin
    for (const control in this.questionFormGroup.controls) {
      console.log(control)
      if (this.courseFormGroup.get(control)) {
        const controlErrors: ValidationErrors = this.courseFormGroup.get(control).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + control + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      }
    };

  }

  onRemoveQuestion(questionIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(
        'Confirm deletion',
        'Are you sure you want to delete the lecture?'
      ),
      maxWidth: '400px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.courseService
          .deleteQuestion(this.question.id)
          .subscribe(res => {
            const control = this.sectionFormGroup.get('questions') as FormArray;
            control.removeAt(questionIndex);
            this.notificationService.showSuccess('Question successfully deleted');
          });

      }
    });
  }

}
