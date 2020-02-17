import { BaseModel } from './base-model';

export class UserAnswer extends BaseModel {
    id: string;
    quizId: string;
    userId: string;
    username: string;
    answerId: string;
    correctAnswerId: string;
}
