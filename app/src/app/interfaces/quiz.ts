import { Deserializable } from './deserializable';
import { Question } from './question';


export class Quiz implements Deserializable {
  id?: string;
  title?: string;
  questions?: Question[];

  deserialize(input: any) {
    Object.assign(this, input);
    this.id = input._id;
    this.questions = input.questions ? input.questions.map(question => new Question().deserialize(question)) : new Question();
    return this;
  }
}
