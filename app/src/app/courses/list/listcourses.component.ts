import { CoursesService } from '../courses.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Course } from '../../interfaces/course';
import { AuthenticationService } from '../../authentication/authentication.service';
import { AlertService } from '../../alert/alert.service';
import { StudentsService } from '../../students/students.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-listcourse',
  templateUrl: './listcourses.component.html',
  styleUrls: ['./listcourses.component.css']
})
export class ListCoursesComponent implements OnInit {

  availableCourses: any[];
  enrolledCourses: Course[];
  currentStudentId: String;
  isAdmin: Boolean;



  constructor(
    public _authService: AuthenticationService,
    public _studentService: StudentsService,
    public _alertService: AlertService,
    public _coursesService: CoursesService,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,) {

  }

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();

    this.currentStudentId = this._authService.getStudent()?._id;

    this.isAdmin = this._authService.isAdmin();

    // enrolled courses only for student display
    if (this.isAdmin) {
      // if (!this._authService.isAdmin()) {
      this._studentService.getEnrolledCourses(this.currentStudentId)
        .subscribe(( data : any) => {
          this.enrolledCourses = data;
          console.log(data)

        });
    }

    // avail courses received for both student and admin display
    this._studentService.getAvailableCourses(this.currentStudentId)
      .subscribe(( data : any)  => {
        this.availableCourses = data;
        console.log(data);
      });

  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<Course> = new MatTableDataSource<Course>();

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  deleteCourse(id: any, code: String) {
    this._coursesService.deleteCourse(id)
      .subscribe(( data : any) => {
        this._alertService.success(`Course (${code}) successfully deleted`, true);
        this.ngOnInit();

      });
  }

}

