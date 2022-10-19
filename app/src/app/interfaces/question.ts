import { Deserializable } from './deserializable';
import {QuestionOption} from './questionoption';
import {QuestionAnswer} from './questionanswer';

export class Question implements Deserializable  {
    id?: string;
    title: string;
    type?: string;
    question?: string;
    options: QuestionOption[];
    answer: QuestionAnswer[];

    deserialize(input: any) {
        Object.assign(this, input);
        this.id = input._id;
        return this;
      }

    // option1?: string;
    // option2?: string;
    // option3?: string;
    // option4?: string;
    // answer?: string;


}

//answer cant be part of questions
//create an obeject
//options needs to be an array
//add addtnal interface and link to this object for answers +answers and opptions
