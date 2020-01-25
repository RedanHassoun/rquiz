import { User } from './user';
import { Quiz } from './quiz';
import { QuizAnswer } from './quiz-answer';

export class UserAnswer {
    id: string;
    quizId: string;
    userId: string;
    answerId: string;
}
