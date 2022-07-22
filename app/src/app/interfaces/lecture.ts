import { Deserializable } from './deserializable';

export class Lecture implements Deserializable {
  id: string;
  title: string;
  type: string;
  videoUrl: string;
  duration: number;
  text: string;


  deserialize(input: any) {
    Object.assign(this, input);
    this.id = input._id;
    return this;
  }
}
