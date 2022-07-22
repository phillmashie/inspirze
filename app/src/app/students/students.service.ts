// import 'rxjs/Rx';
import { catchError, map, throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
//import { Http, Headers, Request, RequestMethod, Response } from '@angular/http';
import { Student } from '../interfaces/student';
import { CourseRegistration } from '../interfaces/course-registration';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StudentsService {
  private _baseURL = '/api/students';
  private _courseBaseURL = '/api/courses';

  constructor(private _http: HttpClient) { }

  // Student CRUD ==============================================================
  create(student: any): Observable<any> {
    return this._http
      .post(this._baseURL, student)
      .pipe(
        map((res: Response) => res.json()),
        catchError(error => throwError(() => new Error('Server error')))
      );

  }

  listStudents(): Observable<any> {
    return this._http
      .get(this._baseURL)
      .pipe(
        map((res: Response) => res.json()),
        catchError(error => throwError(() => new Error('Server error')))
      );

  }

  getStudent(id: any): Observable<any> {
    return this._http
      .get(this._baseURL + '/' + id)
      .pipe(
        map((res: Response) => res.json()),
        catchError(error => throwError(() => new Error('Server error')))
      );

  }

  updateStudent(id: String, student: Student): Observable<any> {
    return this._http
      .put(this._baseURL + '/' + id, student)
      .pipe(
         map(res => console.log(res)),
         catchError(error => throwError(() => new Error('Server error')))
      );

  }

  deleteStudent(id: String): Observable<any> {
    return this._http
      .delete(this._baseURL + '/' + id)
      .pipe(
        map(res => console.log(res)),
        catchError(error => throwError(() => new Error('Server error')))
      );


  }

  // Course Manipulation =========================================================
  enrollInCourse(courseRegistration: CourseRegistration) {
    return this._http
      .post(this._baseURL + '/courses', courseRegistration)
      .pipe(
         map(res => console.log(res)),
         catchError(error => throwError(() => new Error('Server error')))
      );

  }

  dropCourse(courseRegistration: CourseRegistration) {
    return this._http
      .delete(this._baseURL + '/courses/' + JSON.stringify(courseRegistration))
      .pipe(
        map(res => console.log(res)),
        catchError(error => throwError(() => new Error('Server error')))
      );

  }

  getEnrolledCourses(studentId: String): Observable<any> {
    return this._http
      .get<any>(this._courseBaseURL + '/getEnrolled/' + studentId)
      .pipe(
        map((res: Response) => {
          return res.json();
        }),
        catchError(error => throwError(() => new Error('Server error')))
      );

  }

  getAvailableCourses(studentId: String): Observable<any[]> {
    return this._http
      .get<any[]>(this._courseBaseURL + '/getAvailable/' + studentId)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(error => throwError(() => new Error('Server error')))
      );

  }

  private handleError(error: Response) {
    return throwError(() => new Error('Server error'));
  }
}
