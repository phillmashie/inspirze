import { Deserializable } from './deserializable';
import { Lecture } from './lecture';
import { QuestionData } from './question-data';


export class Section implements Deserializable {
  id?: string;
  title?: string;
  lectures?: Lecture[];
  questions?: QuestionData[];

  deserialize(input: any) {
    Object.assign(this, input);
    this.id = input._id;
    this.lectures = input.lectures ? input.lectures.map(lecture => new Lecture().deserialize(lecture)) : new Lecture();
    this.questions = input.questions ? input.questions.map(question => new QuestionData().deserialize(question)) : new QuestionData();
    return this;
  }
}
