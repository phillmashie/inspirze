import { Component, OnInit } from '@angular/core';
import { Course } from '../../interfaces/course';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../alert/alert.service';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.css']
})
export class UpdateCourseComponent implements OnInit {

  public courseId: String;
  public course: any;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _alertService: AlertService,
    private _courseService: CoursesService) {
    this._route.queryParams.subscribe(params => this.courseId = params['id']);
  }

  ngOnInit() {
    this._courseService
      .getCourse(this.course?._id)
      .subscribe(course => this.course = course);
  }

  update() {
    this._courseService
      .updateCourse(this.course._id, this.course)
      .subscribe(( updatedCourse : any) => {
        this._alertService.success(`Course (${updatedCourse.courseCode}) successfully updated`, true);
        this._router.navigate(['/courses/details'],
          { queryParams: { 'id': updatedCourse._id } }
        );
        error => this._alertService.error(error);
      });

     
  }

}
