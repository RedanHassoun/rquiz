import { User } from './user';
import { Quiz } from './quiz';
import { QuizAnswer } from './quiz-answer';

export class UserAnswer {
    id: string;
    quiz: Quiz;
    user: User;
    quizAnswer: QuizAnswer;
}
