import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionData } from '../../../interfaces/question-data';
import { Subject } from 'rxjs';

import { environment } from "../../../../environments/environment";
// import { AuthService } from './auth.service';

const apiUrl = environment.backendURL;

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questions: QuestionData[] = [];
  private questionsUpdated = new Subject<{ questions: QuestionData[]}>();

  constructor(private http: HttpClient ) { }

  getData() {
    this.http.get<{ questions: QuestionData[] }>(apiUrl + '/question')
    .subscribe((questions) => {
      this.questions = questions.questions;
      this.questionsUpdated.next({ questions: this.questions });
    });
  }

  getQuestionsUpdateListener() {
    return this.questionsUpdated.asObservable();
  }

  sendMarks(marks: number) {
    let userEmail = localStorage.getItem("email");
    const data = {
      userEmail: userEmail,
      marks: marks
    };
    this.http.post(apiUrl + "/question/mark", data)
    .subscribe(response => {
        console.log(response);
        alert('Your Submission has been made! Thank You.');
        setTimeout(() => {
            
        }, 2000);
    });
}
}