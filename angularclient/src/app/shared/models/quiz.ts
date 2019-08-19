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
    numberOfCorrectAnswers: number;
    totalNumberOfAnswers: number;

    reset() {
        this.id = null;
        this.title = '';
        this.description = '';
        this.imageUrl = '';
        this.isPublic = false;
        this.answers = [];
        this.numberOfCorrectAnswers = 0;
        this.totalNumberOfAnswers = 0;
    }

    addAnswer(answer: QuizAnswer) {
        this.answers.push(answer);
    }
}
