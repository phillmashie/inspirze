// import 'rxjs/Rx';
import { catchError, map, throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
//import { Http, Headers, Request, RequestMethod, Response } from '@angular/http';
import { Student } from '../interfaces/student';
import { CourseRegistration } from '../interfaces/course-registration';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class StudentsService {
  private _baseURL = environment.backendURL +'api/students';
  private _courseBaseURL = environment.backendURL + 'api/courses';

  constructor(private _http: HttpClient) { }

  // Student CRUD ==============================================================
  create(student: any): Observable<any> {
    return this._http
      .post(this._baseURL, student);
     

  }

  listStudents(): Observable<any> {
    return this._http
      .get(this._baseURL);
     

  }

  getStudent(id: any): Observable<any> {
    return this._http
      .get(this._baseURL + '/' + id);
     

  }

  updateStudent(id: String, student: Student): Observable<any> {
    return this._http
      .put(this._baseURL + '/' + id, student);
    

  }

  deleteStudent(id: String): Observable<any> {
    return this._http
      .delete(this._baseURL + '/' + id);
    


  }

  // Course Manipulation =========================================================
  enrollInCourse(courseRegistration: CourseRegistration) {
    return this._http
      .post(this._baseURL + '/courses', courseRegistration);
    

  }

  dropCourse(courseRegistration: CourseRegistration) {
    return this._http
      .delete(this._baseURL + '/courses/' + JSON.stringify(courseRegistration));
      

  }

  getEnrolledCourses(studentId: String): Observable<any>  {
    return this._http
      .get(this._courseBaseURL + '/getEnrolled/' + studentId);
      

  }

  getAvailableCourses(studentId: String): Observable<any> {
    return this._http
      .get(this._courseBaseURL + '/getAvailable/' + studentId);
      

  }

  private handleError(error: Response) {
    return throwError(() => new Error('Server error'));
  }
}
