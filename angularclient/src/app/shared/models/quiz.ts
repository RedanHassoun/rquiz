import { BaseModel } from './base-model';
import { AlreadyExistError } from './../app-errors/already-exist-error';
import { UserAnswer } from './user-answer';
import { QuizAnswer } from './quiz-answer';
import { User } from './user';
import * as _ from 'lodash';

export class Quiz extends BaseModel {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    isPublic: boolean;
    assignedUsers: User[];
    creator: User;
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

    public setCorrectAnswer(correctAnswer: QuizAnswer): void {
        for (const answer of this.answers) {
            if (answer.content === correctAnswer.content) {
                answer.isCorrect = true;
            } else {
                answer.isCorrect = false;
            }
        }
    }

    public deleteAnswer(answer: QuizAnswer): void {
        this.answers = _.remove(this.answers, (quizAnswer) => {
            return quizAnswer.content !== answer.content;
        });
    }

    public isCreatedByUser(userId: string): boolean {
        if (!userId) {
            return false;
        }

        if (this.creator.id === userId) {
            return true;
        }
        return false;
    }

    public hasCorrectAnswer(): boolean {
        for (const answer of this.answers) {
            if (answer.isCorrect) {
                return true;
            }
        }
        return false;
    }

    public getAnswerById(answerId: string): string {
        const quizAnswers: QuizAnswer[] = this.answers;
        if (!quizAnswers) {
            return null;
        }
        for (const answer of quizAnswers) {
          if (answer.id === answerId) {
            return answer.content;
          }
        }
        return null;
      }
}
