import { User } from './../../shared/models/user';
import { AppUtil } from './../../shared/util/app-util';
import { Quiz } from './../../shared/models/quiz';
import { AppNotificationMessage } from './../../core/common/socket-consts';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizCrudService {

  constructor() { }

  public handleQuizAnswersUpdate(message: AppNotificationMessage, quizList: Quiz[]): void {
    if (!message || !message.content) {
      return;
    }

    const quiz: Quiz = JSON.parse(message.content);
    const indexOfQuiz = quizList.findIndex(currQuiz => currQuiz.id === quiz.id);

    if (indexOfQuiz !== -1) {
      quizList[indexOfQuiz] = quiz;
    }
  }

  public handleQuizDeletedUpdate(message: AppNotificationMessage, quizList: Quiz[]): void {
    const id: string = JSON.parse(message.content).id;
    quizList = AppUtil.removeById(quizList, id);
  }

  public handleAddedQuiz(message: AppNotificationMessage, quizList: Quiz[]): void {
    if (!message || !message.content) {
      return;
    }

    const quiz: Quiz = JSON.parse(message.content);
    quizList.unshift(quiz);
  }

  public isQuizCreatedByUser(quiz: Quiz, userId: string): boolean {
    if (!userId) {
      throw new Error('User id is not defined');
    }
    if (!quiz) {
      return false;
    }

    if (quiz.creator.id === userId) {
      return true;
    }
    return false;
  }
}
