// // import { map, catchError } from 'rxjs/operators';
// // import { Observable, throwError } from 'rxjs';
// // import { Injectable } from '@angular/core';
// // //import { Http, Headers, Request, RequestMethod, Response } from '@angular/http';
// // import { Course } from '../interfaces/course';
// // import { HttpClient} from '@angular/common/http';


// // @Injectable()
// // export class CoursesService {

// //     private _courseBaseURL = '/api/courses';

// //     constructor(private _http: HttpClient) { }

// //     listCourses(): Observable<any> {
// //         return this._http
// //             .get(this._courseBaseURL)
// //             .pipe(
// //               map(res => console.log(res)),
// //               catchError(error => throwError(() => new Error('Server error')))
// //             );

// //     }

// //     createCourses(course: any): Observable<any> {
// //         return this._http
// //             .post(this._courseBaseURL, course)
// //             .pipe(
// //               map(res => console.log(res)),
// //               catchError(error => throwError(() => new Error('Server error')))
// //             );


// //     }

// //    deleteCourse(id: any): Observable<any> {
// //         return this._http
// //             .delete(this._courseBaseURL + '/' + id)
// //             .pipe(
// //               //   .get(this._courseBaseURL + '/delete/' + code)
// //             map(res => console.log(res)),
// //             catchError(error => throwError(() => new Error('Server error')))
// //             );


// //     }

// //    getCourse(id: any): Observable<any> {
// //         return this._http
// //             .get(this._courseBaseURL + '/' + id)
// //             .pipe(
// //               map(res => console.log(res)),
// //               catchError(error => throwError(() => new Error('Server error')))


// //             );

// //     }

// //     updateCourse(id: String, course: Course): Observable<any> {
// //         return this._http
// //             .put(this._courseBaseURL + '/' + id, course)
// //             .pipe(
// //               //   .post(this._courseBaseURL + '/updatecourse', c)

// //               map(res => console.log(res)),
// //               catchError(error => throwError(() => new Error('Server error')))
// //             );


// //     }

// //     getNotEnrolledStudents(courseId: String) {
// //         return this._http
// //             .get(this._courseBaseURL + '/getNotEnrolledStudents/' + courseId)
// //             .pipe(
// //               map(res => {
// //                 return res;
// //             }),
// //             catchError(error => throwError(() => new Error('Server error')))
// //             );


// //     }

// //     private handleError(error: Response) {
// //         return throwError(() => new Error('Server error'));
// //     }
// // }
// // //reference page to update my services http
// // //https://www.telerik.com/blogs/updating-to-angular-httpclient-simpler-http-calls

// import 'rxjs';
// import { Observable, throwError,catchError } from 'rxjs';
// import { Injectable } from '@angular/core';
// //import { Http, Headers, Request, RequestMethod, Response } from '@angular/http';

// import { Course } from '../interfaces/course';
// import { HttpClient } from '@angular/common/http';

// @Injectable()
// export class CoursesService {

//     private _courseBaseURL = '/api/courses';

//     constructor(private _http: HttpClient) { }

//     listCourses(): Observable<Course[]> {
//         return this._http.get<Course[]>(this._courseBaseURL);
//     }

//     async createCourses(course: any): Promise<any> {
//       const data = await this._http
//         .post(this._courseBaseURL, course)
//         .toPromise();
//       return data;
//   }

//     deleteCourse(id: any): Observable<Course> {
//         return this._http.delete<Course>(this._courseBaseURL + '/' + id);
//             //   .get(this._courseBaseURL + '/delete/' + code)

//     }

//     getCourse(id: any): Observable<Course> {
//         return this._http.get<Course>(this._courseBaseURL + '/' + id);

//     }

//     updateCourse(id: String, course: Course): Observable<Course> {
//         return this._http.put<Course>(this._courseBaseURL + '/' + id, course);
//             //   .post(this._courseBaseURL + '/updatecourse', c)

//     }

//     getNotEnrolledStudents(courseId: String): Observable<any> {
//         return this._http.get<any>(this._courseBaseURL + '/getNotEnrolledStudents/' + courseId);

//     }

//     private catchError(_error: Response) {
//         return throwError(() => new Error('Server error'));
//     }
// }
//2022.07.07 11:50:30 Refactored
import 'rxjs';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Course } from '../interfaces/course';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class CoursesService {

    private _courseBaseURL = '/api/courses';

    constructor(private _http: HttpClient) { }

    listCourses(): Observable<any> {
        return this._http.get(this._courseBaseURL);

    }

    createCourse(course: Course): Observable<any> {
        return this._http.post<any>(this._courseBaseURL, course);

    }

    deleteCourse(id: string): Observable<any> {
        return this._http.delete(this._courseBaseURL + '/' + id);

    }

    deleteSection(id: string, courseId: string) {
      return this._http.delete(this._courseBaseURL + '/' + id);

    }

    deleteLecture(id: string){
      return this._http.delete(this._courseBaseURL + '/' + id);
    }

    getCourse(id: string): Observable<any> {
        return this._http.get(this._courseBaseURL + '/' + id);

    }

    updateCourse(id: string, course: Course): Observable<any> {
        return this._http.put(this._courseBaseURL + '/' + id, course);

    }

    getNotEnrolledStudents(courseId: String) {
        return this._http.get<any>(this._courseBaseURL + '/getNotEnrolledStudents/' + courseId);

    }
    uploadVideoLecture(video: File, lectureId: string, sectionId: string, courseId: string) {
      const formData = new FormData();
      formData.append('lectureId', lectureId);
      formData.append('sectionId', sectionId);
      formData.append('courseId', courseId);
      formData.append('video', video);

      return this._http.post(environment.backendURL + 'uploadVideoLecture', formData, {
        reportProgress: true,
        observe: 'events'
      }).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
          } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          console.log(errorMessage);
          return throwError(errorMessage);
        })
      );
  }
}


