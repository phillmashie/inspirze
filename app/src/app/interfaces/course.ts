// import { Student } from './student';

// export interface Course {
//     _id?: String;
//     courseCode?: String;
//     courseName?: String;
//     subtitle?: String;
//     description?: String;
//     section?: Number;
//     semester?: Number;
//     students?: Student[];
// }

import { Student } from './student';
import { Deserializable } from './deserializable';
import { Section } from './section';

export class Course implements Deserializable {
  _id?: string;
  courseCode?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  rating?: number;
  sections?: Section[];
  students?: Student[];

  deserialize(input: any) {
    Object.assign(this, input);
    this._id = input?._id;
    this.sections = input?.sections ? input.sections.map((section: any) => new Section().deserialize(section)) : new Section();
    return this;
  }
}
