import { Deserializable } from './deserializable';

export class QuestionData implements Deserializable {
    id?: string;
    title?: string;
    type?: string;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer: string;

    deserialize(input: any) {
        Object.assign(this, input);
        this.id = input._id;
        return this;
      }

    
}