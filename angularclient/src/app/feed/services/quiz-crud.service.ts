import { QuizService } from './quiz.service';
import { UserAnswer } from 'src/app/shared/models/user-answer';
import { AlreadyExistError } from './../../shared/app-errors/already-exist-error';
import { QuizAnswer } from './../../shared/models/quiz-answer';
import { AppUtil } from './../../shared/util/app-util';
import { Quiz } from './../../shared/models/quiz';
import { AppNotificationMessage } from './../../core/common/socket-consts';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizCrudService {

  constructor(private quizService: QuizService) { }

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
    AppUtil.removeById(quizList, id);
  }

  public handleAddedQuiz(message: AppNotificationMessage, quizList: Quiz[]): void {
    if (!message || !message.content) {
      return;
    }

    const quiz: Quiz = JSON.parse(message.content);
    const quizFilterResult = quizList.filter(q => q.id === quiz.id);
    if (quizFilterResult && quizFilterResult.length > 0) {
      return;
    }
    quizList.unshift(quiz);
  }

  public addAnswer(quiz: Quiz, answerContent: string, AlreadyExistCallback?: (ex: Error) => void): void {
    if (!answerContent) {
      return;
    }
    const answer = new QuizAnswer();
    answer.content = answerContent;
    answer.isCorrect = false;

    try {
      quiz.addAnswer(answer);
    } catch (ex) {
      if (ex instanceof AlreadyExistError) {
        if (AlreadyExistCallback) {
          AlreadyExistCallback(ex);
        } else {
          throw ex;
        }
      } else {
        throw ex;
      }
    }
  }

  public async getUserAnswerForQuiz(quiz: Quiz, userId: string, showLoader = false): Promise<UserAnswer> {
    try {
      if (!!showLoader) {
        AppUtil.triggerLoadingIndicator();
      }

      const userAnswerListResult: UserAnswer[] = await this.quizService
        .getUserAnswerForQuiz(quiz.id, userId).toPromise();

      if (!!showLoader) {
        AppUtil.triggerLoadingIndicatorStop();
      }

      if (userAnswerListResult && userAnswerListResult.length > 0) {
        const userAnswer: UserAnswer = userAnswerListResult[0];
        return userAnswer;
      }

      return null;
    } catch (ex) {
      if (!!showLoader) {
        AppUtil.triggerLoadingIndicatorStop();
      }
      throw ex;
    }
  }
}
