import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, ValidationErrors, NgForm, FormBuilder, Validators } from '@angular/forms';
import { CoursesService } from '../../../courses.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Lecture } from '../../../../interfaces/lecture';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-lecture',
  templateUrl: './course-lecture.component.html',
  styleUrls: ['./course-lecture.component.sass']
})
export class CourseLectureComponent implements OnInit, OnDestroy {
  changeVideoSubject: Subject<void> = new Subject<void>();

  @Input() lectureFormGroup: FormGroup;
  @Input() sectionFormGroup: FormGroup;
  @Input() courseFormGroup: FormGroup;
  @Input() lectureIndex: number;
  @Input() sectionIndex: number;

  formChangesSubscription: Subscription;

  progress = 0;
  successMsg = '';
  lecture: Lecture;
  sectionId: string;
  courseId: string;
//quiz component variables
  msg: any = [];
  avail: boolean;
  quizid:any;
  obj:any;
  options:any[]= [];

  backendURL = environment.backendURL;

  constructor(
    private courseService: CoursesService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.lecture = new Lecture().deserialize(this.lectureFormGroup.value);
    this.sectionId = this.sectionFormGroup.get('id').value;
    this.courseId = this.courseFormGroup.get('id').value;
    this.formChangesSubscription = this.subcribeToFormChanges();


  }

  form = this.fb.group({
    question: [
      '',
      {
        validators: [Validators.required],
      },
    ],
    answer: ['', [Validators.required, Validators.minLength(1)]],
    options: this.fb.array([]),
  });

  get answerOptionsFieldAsFormArray(): any {
    return this.form.get('options') as unknown as FormArray;
  }

  option(): any {
    return this.fb.group({
      role: this.fb.control(''),
    });
  }

  addControl(): void {
    this.answerOptionsFieldAsFormArray.push(this.option());
  }

  remove(i: number): void {
    this.answerOptionsFieldAsFormArray.removeAt(i);
  }

  formValue(): void {
    console.log(this.form.value);
  }

  ngOnDestroy(): void {
    this.formChangesSubscription.unsubscribe();
  }

  subcribeToFormChanges() {
    const formValueChanges$ = this.lectureFormGroup.valueChanges;
    return formValueChanges$.subscribe(formValue => { this.lecture = new Lecture().deserialize(formValue); this.getFormValidationErrors()});
  }

  getFormValidationErrors() {
    // tslint:disable-next-line: forin
    for (const control in this.lectureFormGroup.controls) {
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

  onRemoveLecture(lectureIndex: number) {
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
          .deleteLecture(this.lecture.id)
          .subscribe(res => {
            const control = this.sectionFormGroup.get('lectures') as FormArray;
            control.removeAt(lectureIndex);
            this.notificationService.showSuccess('Lecture successfully deleted');
          });

      }
    });
  }

}
