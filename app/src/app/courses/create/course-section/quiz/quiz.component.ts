import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, ValidationErrors, FormBuilder } from '@angular/forms';
import { CoursesService } from '../../../courses.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Question } from '../../../../interfaces/question';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.sass']
})
export class QuizComponent implements OnInit, OnDestroy {
  changeVideoSubject: Subject<void> = new Subject<void>();

  @Input() questionFormGroup: FormGroup;
  @Input() sectionFormGroup: FormGroup;
  @Input() courseFormGroup: FormGroup;
  @Input() questionIndex: number;
  @Input() sectionIndex: number;

  formChangesSubscription: Subscription;

  progress = 0;
  successMsg = '';
  question: Question;
  sectionId: string;
  courseId: string;

  backendURL = environment.backendURL;

  constructor(
    private coursesService: CoursesService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private fb: FormBuilder
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



    // for (const i in this.courseFormGroup.controls.sections['controls']) {
    //   for (const control in this.courseFormGroup.controls.sections['controls'][i]['controls']) {
    //     const controlErrors: ValidationErrors = this.courseFormGroup.controls.sections['controls'][i]['controls'][control].errors;
    //     if (controlErrors != null) {
    //       Object.keys(controlErrors).forEach(keyError => {
    //         console.log('Key control: ' + control + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
    //       });
    //     }
    //   }
    // }
  }

  get optionsFieldAsFormArray(): any {
    return this.questionFormGroup.get('options') as FormArray;
  }

  options(): any {
    return this.fb.group({
      options: this.fb.control(''),
    });
  }

  addControl(): void {
    this.optionsFieldAsFormArray.push(this.options());
  }

  remove(i: number): void {
    this.optionsFieldAsFormArray.removeAt(i);
  }


  onRemoveQuestion(questionIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(
        'Confirm deletion',
        'Are you sure you want to delete the Question?'
      ),
      maxWidth: '400px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.coursesService
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
