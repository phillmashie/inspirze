import { Lecture } from './../../../../interfaces/lecture';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, ValidationErrors } from '@angular/forms';

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CoursesService } from 'src/app/courses/courses.service';


@Component({
  selector: 'app-course-lecture',
  templateUrl: './course-lecture.component.html',
  styleUrls: ['./course-lecture.component.sass']
})
export class CourseLectureComponent implements OnInit, OnDestroy {
  changeVideoSubject: Subject<void> = new Subject<void>();

  @Input() lectureFormGroup: any = UntypedFormGroup;
  @Input() sectionFormGroup: any = UntypedFormGroup;
  @Input() courseFormGroup: any = UntypedFormGroup;
  @Input() lectureIndex?: number;

  formChangesSubscription: any = Subscription;

  progress = 0;
  successMsg = '';
  lecture: Lecture;
  sectionId: string;
  courseId: string;

  backendURL = environment.backendURL;

  constructor(
    private courseService: CoursesService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.lecture = new Lecture().deserialize(this.lectureFormGroup.value);
    this.sectionId = this.sectionFormGroup.get('id').value;
    this.courseId = this.courseFormGroup.get('id').value;
    this.formChangesSubscription = this.subcribeToFormChanges();
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


  onVideoSelected(videoFile: File) {
    // Upload to server
    this.courseService
      .uploadVideoLecture(videoFile, this.lecture.id, this.sectionId, this.courseId)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {

          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event?.total * 100);
            break;
          case HttpEventType.Response:
            this.lectureFormGroup.get('videoUrl').setValue(event.body.filePath);
            this.progress = 0;
        }
      });
  }

  onChangeVideo() {
    this.changeVideoSubject.next();
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
            const control = this.sectionFormGroup.get('lectures') as UntypedFormArray;
            control.removeAt(lectureIndex);
            this.notificationService.showSuccess('Lecture successfully deleted');
          });

      }
    });
  }

}
