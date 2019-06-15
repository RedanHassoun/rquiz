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

    reset() {
        this.id = null;
        this.title = '';
        this.description = '';
        this.imageUrl = '';
        this.isPublic = false;
    }

    addAnswer(answer: QuizAnswer) {
        this.answers.push(answer);
    }
}
