import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from "@angular/forms"
import { QUESTIONS } from "./questions"
var numberCount: number = 0;

@Component({
  template: ''
})
export class BaseComponent{

  @Input() set questions(value:any[]){
    this.nestedQuestions = value;
  }

  @Input() questionFormArray:any[] = [];

  nestedQuestions: any[] = [];

  questionWiseFormGroups: { [key: number]: FormArray };

  constructor(public formBuilder:FormBuilder){
    if(!this.questionFormArray)
      this.questionFormArray = [];
  }

 get uniqueId() {
    numberCount = numberCount+ 1;
    return numberCount;
  }

  getFormGroup(question: { [key: string]: any }) {
    return this.formBuilder.group(question);
  }

  addNewQuestion(arg0: number,arg1: number) {
    throw new Error('Method not implemented.');
    }

  addChildQuestion(parentQuestion: any) {
    let question = { questionId: this.uniqueId, parentQuestionId: parentQuestion.questionId, question: '', answer: '',questions:[] }
    parentQuestion.questions.push(question)
    this.addFormGroup(question)

  }

  addFormGroup(question:any){
    if (!this.questionWiseFormGroups)
      this.questionWiseFormGroups = { [question.parentQuestionId]: this.formBuilder.array([]) };
    else if(!this.questionWiseFormGroups[question.parentQuestionId])
    this.questionWiseFormGroups[question.parentQuestionId] = this.formBuilder.array([])

    let currentFormArray = this.questionWiseFormGroups[question.parentQuestionId]
    currentFormArray.push(this.getFormGroup(question));;
    this.questionFormArray.push(currentFormArray.controls[currentFormArray.controls.length -1]);

  }


}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
})
export class QuizComponent extends BaseComponent implements OnInit {



  constructor(
     formBuilder: FormBuilder) {
      super(formBuilder)
      }

  ngOnInit() {
    let question = { questionId: this.uniqueId, parentQuestionId: 0, question: 'abc', answer: '', questions: [] }
    this.questions = [question];
    this.addFormGroup(question);
  }

  save(){
    var serverData = [];
    this.questionFormArray.forEach(t=>serverData.push(t.value));
    console.log(serverData)
  }


}

@Component({
  selector: 'app-question-tree',
  template: `
  <h1>{{title}}</h1>
  <div   *ngFor="let question of nestedQuestions;let i = index">
  <div [formGroup]="formGroups.controls[i]">
     <label>Question</label>
      <input type="text" formControlName="question" class="form-control"  />
      <label>Answer</label>
      <input type="text" formControlName="answer" class="form-control"  />
      </div>
      <button class="btn btn-primary" (click)="addChildQuestion(question)">Add</button>
      <app-question-tree  [questionFormArray]="questionFormArray" [questionId]="question.questionId" [questions]="question.questions" [formGroups]="questionWiseFormGroups[question.questionId]"></app-question-tree>
    </div>



  `,
})
export class QuestionTreeComponent extends BaseComponent {
    parentQuestionId:number;
    @Input() formGroups:FormArray;

    @Input() set questionId(value:number){
      this.parentQuestionId = value;
      this.questionWiseFormGroups = {[value]:this.formBuilder.array([])     }
    }

    @Input() title:string

    constructor(formBuilder:FormBuilder){
      super(formBuilder)
    }
}
