import { HttpClient, HttpResponse, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

//import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Credentials } from '../interfaces/credentials';
import { Student } from '../interfaces/student';

@Injectable()
export class AuthenticationService {
  // public student;
  private _baseURL = environment.backendURL + 'api/students';
  private _student: Student;

  constructor(private _http: HttpClient) { 
    //this._student=this._student;
  }

  //this._student=this._student.bind(this);

  isLoggedIn(): boolean {
    // return this.student;
    //console.log(`inside auth service checking if loggedin: ${sessionStorage.getItem('currentStudent') !== null}`);
    return sessionStorage?.getItem('currentStudent') !== null;
  }

  isAdmin(): boolean {
    this._student = JSON.parse(sessionStorage.getItem('currentStudent'));
    return this._student?.role === 'admin';
  }

  getStudent(): Student {
    return JSON.parse(sessionStorage.getItem('currentStudent'));
  }

  login(credentials: Credentials): Observable<any> {
    // perform a request with 'post' http method
    return this._http
      .post(this._baseURL + '/login', credentials);
      // .map(res => this.student = res.json())
      
      
  }

  // 2022.06.28 - 22:03:42
  logout() {
    // remove student from session storage to log user out
    sessionStorage.removeItem('currentStudent');
    // this.student = undefined;
  }

  private _handleError(error: Response) {
    return throwError(() => new Error('Server error'));
  }
}
