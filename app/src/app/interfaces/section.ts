import { Deserializable } from './deserializable';
import { Lecture } from './lecture';


export class Section implements Deserializable {
  id: string;
  title: string;
  lectures: Lecture[];

  deserialize(input: any) {
    Object.assign(this, input);
    this.id = input._id;
    this.lectures = input.lectures ? input.lectures.map(lecture => new Lecture().deserialize(lecture)) : new Lecture();
    return this;
  }
}
