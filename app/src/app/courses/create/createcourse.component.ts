import { AlertService } from '../../alert/alert.service';

import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormArray, ValidationErrors, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CoursesService } from '../courses.service';
import { environment } from 'src/environments/environment';
import { Course } from '../../interfaces/course';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';

 @Component({
   selector: 'app-createcourse',
   templateUrl: './createcourse.component.html',
   styleUrls: ['./createcourse.component.sass']
 })
 //export class CreateCourseComponent {

//   course: Course = {
//     courseCode: 'COMP308',
//     title: 'Inspirze Context Technology',
//     subtitle: 'Why Inspirze',
//     description: 'Weaving people into the fabric of your brand'
//     rating: 5;



//   };

//   constructor(private _router: Router,
//     private _alertService: AlertService,
//     private _coursesService: CoursesService) {

//   }

//   create() {
//     this._coursesService
//       .createCourses(this.course)
//       .subscribe(createdCourse => {
//         this._alertService.success(`Course (${createdCourse.courseCode}) successfully created`, true);
//         this._router.navigate(['/courses/details'],
//           { queryParams: { 'id': createdCourse._id } }
//         );
//       },
//         error => this._alertService.error(error));
//   }
// }

export class CreateCourseComponent implements OnInit, OnDestroy, AfterContentChecked {
  formChangesSubscription: Subscription;
  course: Course;
  courseFormGroup: FormGroup;
  editMode = false;
  formValueHasChanged = false;
  private originalFormValue: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private courseService: CoursesService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef
  ) { }

  getFormGroupLectures(lectures: any): FormGroup[] {
    if (!lectures || lectures.length === 0) {
      return [
        this.fb.group({
          id: null,
          title: [null, Validators.required],
          type: ['quiz', Validators.required],
          quiz: null,
          text: null,

        })
      ];
    }

    const formGroup = [];
    for (const lecture of lectures) {
      formGroup.push(
        this.fb.group({
          id: lecture._id,
          title: [lecture.title, Validators.required],
          type: [lecture.type, Validators.required],
          quiz: lecture.quiz,
          text: lecture.text,
        })
      );
    }
    return formGroup;
  }


  getFormGroupQuestions(questions: any): FormGroup[] {
    if (!questions || questions.length === 0) {
      return [
        this.fb.group({
        id: null,
        title: [null, Validators.required],
        question: null,
        options: null,
        answer: null,

        })
      ];
    }

    const formGroup = [];
    for (const question of questions) {
      formGroup.push(
        this.fb.group({
          id: question._id,
          title: [question.title, Validators.required],
          type: [question.type, Validators.required],
          question: question.question,
          options: question.options,
          answer: question.answer
        })
      );
    }
    return formGroup;
  }


  getFormGroupSections(sections: any): FormGroup[] {
    if (!sections) {
      return [
        this.fb.group({
          id: null,
          title: [null, Validators.required],
          lectures: this.fb.array(this.getFormGroupLectures(null)),
          questions: this.fb.array(this.getFormGroupQuestions(null))
        })
      ];
    }

    const formGroup = [];
    for (const section of sections) {
      formGroup.push(
        this.fb.group({
          id: section.id,
          title: [section.title, Validators.required],
          lectures: this.fb.array(this.getFormGroupLectures(section.lectures)),
          questions: this.fb.array(this.getFormGroupQuestions(section.questions))
        })
      );
    }

    return formGroup;
  }

  setForm(course?: any): FormGroup {
    if (!course) {
      course = {};
    }

    const formGroup = this.fb.group({
      id: course.id,
      courseCode: [course.courseCode, Validators.required],
      title: [course.title, Validators.required],
      subtitle: [course.subtitle, Validators.required],
      description: [course.description, Validators.required],
      sections: this.fb.array(this.getFormGroupSections(course.sections))
    });

    this.originalFormValue = formGroup.value;
    this.formValueHasChanged = false;

    this.formChangesSubscription = formGroup.valueChanges.subscribe(
      changedFormValue => {
        this.formValueHasChanged = !_.isEqual(this.originalFormValue, changedFormValue);
        this.course = new Course().deserialize({ ...this.course, ...changedFormValue });
      }
    );

    return formGroup;
  }

  ngOnInit() {
    this.courseFormGroup = this.setForm();

    if (this.route.snapshot.params['id']) { // editing mode
      const id = this.route.snapshot.params['id'];
      this.courseService
        .getCourse(id)
        .subscribe(({ data }: any) => {
          this.editMode = true;
          const course = data.course;
          this.course = new Course().deserialize(course);
          this.courseFormGroup = this.setForm(course);
        });
    }
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.formChangesSubscription.unsubscribe();
  }

  onSubmit() {
    const formValue = { ...this.courseFormGroup.value };
    if (formValue.image && formValue.image.files) {
      formValue.image = formValue.image.files[0];
    }
    if (this.editMode) {
      this.courseService
        .updateCourse(this.course._id, formValue)
        .subscribe((data : any) => {
          const updatedCourse = data.updateCourse;
          this.course = new Course().deserialize(updatedCourse);
          this.courseFormGroup = this.setForm(updatedCourse);
          this.notificationService.showSuccess('Course successfully updated');
        });
    } else {
      this.courseService
        .createCourse(formValue)
        .subscribe((course : any) => {
          this.notificationService.showSuccess('Course successfully created');
          this.router.navigate(['/courses/details']);
        });
    }
  }

  onAddSection() {
    (this.courseFormGroup.get('sections') as FormArray).push(
      this.fb.group({
        id: null,
        title: [null, Validators.required],
        lectures: this.fb.array(this.getFormGroupLectures(null)),
        questions: this.fb.array(this.getFormGroupQuestions(null)),
      })
    );
  }


  onBack() {
    if (!this.formValueHasChanged) {
      this.router.navigate(['/courses']);
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: new ConfirmDialogModel(
          'Confirm action',
          'The course contains unsaved changes. Are you sure you want to go back?'
        ),
        maxWidth: '400px'
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.router.navigate(['/courses']);
        }
      });
    }
  }
}
