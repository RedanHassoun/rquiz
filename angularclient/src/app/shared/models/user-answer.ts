import { BaseModel } from './base-model';

export class UserAnswer extends BaseModel {
    id: string;
    quizId: string;
    userId: string;
    username: string;
    answerId: string;
    correctAnswerId: string;

    public isCorrect(): boolean {
        if (!this.answerId) {
            return false;
        }
        return this.answerId === this.correctAnswerId;
    }
}
