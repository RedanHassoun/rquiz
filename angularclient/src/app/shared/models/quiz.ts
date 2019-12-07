import { AlreadyExistError } from './../app-errors/already-exist-error';
import { UserAnswer } from './user-answer';
import { QuizAnswer } from './quiz-answer';
import { User } from './user';
export class Quiz {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    isPublic: boolean;
    assignedUsers: User[];
    creatorId: string;
    answers: QuizAnswer[] = [];
    userAnswers: UserAnswer[] = [];
    numberOfCorrectAnswers: number;
    totalNumberOfAnswers: number;

    reset() {
        this.id = null;
        this.title = '';
        this.description = '';
        this.imageUrl = '';
        this.isPublic = true;
        this.answers = [];
        this.numberOfCorrectAnswers = 0;
        this.totalNumberOfAnswers = 0;
    }

    addAnswer(answer: QuizAnswer) {
        const availableAnswer: QuizAnswer = this.answers.find(ans => answer.equalTo(ans));
        if (availableAnswer) {
            throw new AlreadyExistError(`The quiz already has answer: ${answer.content}`);
        }

        this.answers.push(answer);
    }
}
