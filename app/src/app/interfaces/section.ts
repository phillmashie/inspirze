import { Deserializable } from './deserializable';
import { Lecture } from './lecture';
import { Question } from './question';


export class Section implements Deserializable {
  id?: string;
  title?: string;
  lectures?: Lecture[];
  questions?: Question[];

  deserialize(input: any) {
    Object.assign(this, input);
    this.id = input._id;
    this.lectures = input.lectures ? input.lectures.map(lecture => new Lecture().deserialize(lecture)) : new Lecture();
    this.questions = input.questions ? input.questions.map(question => new Question().deserialize(question)) : new Question();
    return this;
  }
}
